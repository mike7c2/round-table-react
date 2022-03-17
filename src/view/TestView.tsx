import React, {useEffect, useRef} from "react"
import { PublicKey, Keypair } from "@solana/web3.js";
import {
    useConnection,
    useWallet
} from "@solana/wallet-adapter-react"
import {
    ChatMessage,
    PeerPresence,
    MatchState,
    RoundTable,
    initRoundTable
} from "round-table"
import MyWallet from "../MyWallet";
import logoFile from "../img/RoundTable.jpg";


var roundTableInitialising = false;
var roundTableInitialised = false;
var roundTable: RoundTable | null = null;

function format_time(s : number) {
    return new Date(s).toISOString().slice(-13, -5);
  }

export const TestView = () =>
{
    const {connection} = useConnection()
    const wallet = useWallet()

    if (!roundTable && !roundTableInitialising && wallet.publicKey && wallet.signMessage) {
        roundTableInitialising = true;
        const pubkey = wallet.publicKey;

        const sig = wallet.signMessage(new TextEncoder().encode("KeyGeneratorForRoundTableXoXoXoXo")).then( (sig) => {
            const id = Keypair.fromSeed(sig.slice(0,32));
            initRoundTable(connection, pubkey, new Keypair(), new PublicKey("69GoySbK6vc9QyWsCYTMUjpQXCocbDJansszPTEaEtMp"), "round-table").then( (round) => {
                roundTable = round;
                roundTableInitialised = true;
            })
        });
        
    }

    const [time, setTime] = React.useState(Date.now())
    useEffect(() =>
    {
        const interval = setInterval(() => setTime(Date.now()), 100)
        return () =>
        {
            clearInterval(interval)
        }
    }, [])

    var chat : ChatMessage[];
    var peers : PeerPresence[];
    var matches : MatchState[];

    if (roundTable) {
        chat = roundTable.getChatLog();
        peers = roundTable.getPeers();
        matches = roundTable.getMatches();
    } else {
        chat = [];
        peers = [];
        matches = [];
    }

    function handleTextEnter(event : any) {
        const trollEntry : any = document.getElementById('searchTxt');
        if (trollEntry) {
            if (event.key === "Enter") {
                console.log("Got event");
                if (roundTable) {
                    roundTable.chatManager.sendChatMessage(trollEntry.value);
                    trollEntry.value = ""
                }
            }
        }
    }

    async function asyncAlert(msg : string) {
        alert(msg);
    }
    function startMatch(event : any) {
        const matchType : any = document.getElementById('matchType');
        roundTable?.findMatch(matchType.value, 0, result => {
            if (result.match) {
                asyncAlert("Joined match with hosted by " + result.match?.advertiser.toString() + " with player " + result.match?.claimsSeen[0]);
            } else {
                asyncAlert("Failed to find match");
            }
        })
    }

    function cancelMatch(event : any) {
        roundTable?.stopMatch();
    }

    function joinMatch(event : any) {
        console.log("Joining match")
        console.log(event)
        roundTable?.findMatch(event.target.value, 0, result => {
            if (result.match) {
                asyncAlert("Joined match with hosted by " + result.match?.advertiser.toString() + " with player " + result.match?.claimsSeen[0]);
            } else {
                asyncAlert("Failed to find match");
            }
        })
    }

    if (roundTableInitialised) {
    return (
        <div className="full-screen">
            <div className="main">
                <div className="centered">
                    <img id="logo" src={logoFile} alt="logo"/>
                </div>
                <div className="main-panel">
                    
                    <div className="chat">
                        <div className="bordered">
                            <h1>RoundTable Chat</h1>
                            <ul className="no-bullets">
                            {chat.map((item, index) => (
                                <li key={index}><b>{item.time}</b>:<i>{item.user.toString().slice(0, 6)}</i>:&emsp;{item.msg}</li>
                            ))}
                            </ul>
                            <input name="searchTxt" className="wide" type="text" id="searchTxt" onKeyUp={handleTextEnter}/>
                        </div>
                    </div>
                    <div className="matches">
                        <div className="bordered">

                            <h1>RoundTable Matches</h1>
                            <div className="wide">
                                <input name="matchType" type="text" id="matchType"/>
                                <button type="button" onClick={startMatch}>Start match</button>
                                <button type="button" onClick={cancelMatch}>Cancel match</button> 
                            </div>
                            <ul className="no-bullets">
                            {matches.map((item, index) => (
                                <li key={index}>
                                    <b>{item.matchId.slice(0,6)}</b>&emsp;
                                    {item.match}&emsp;Claims: {item.claimsSeen.length}&emsp;Acks: {item.acksSeen.length}&emsp;
                                    <button onClick={joinMatch} value={item.match}>Join</button>
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>
                    <div className="presence">
                        <div className="bordered">

                            <h1>RoundTable Presence</h1>
                            <p>Active user : last seen</p>
                            <ul className="no-bullets">
                            {peers.map((item, index) => (
                                <li key={index}><b>{item.id.toString().slice(0, 6)}</b>&emsp;<i>{format_time(item.lastSeen)}</i></li>
                            ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
                } else {
        return (
            <div className="full-screen">
                <div className="welcome">
                    <div className="centered">
                        <img id="logo" src={logoFile} alt="logo"/>
                    </div>
                    <div className="centered">
                        {roundTableInitialising &&
                            <h1>Loading Network details</h1>
                        }
                        {!roundTableInitialising &&
                            <MyWallet/>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default TestView
