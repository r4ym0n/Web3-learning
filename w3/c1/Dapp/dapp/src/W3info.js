import React, { Fragment } from "react";
import { useEffect, useState, useRef } from "react";
import BlockInfoTab from "./blockInfoTab";

function W3info(props) {
    const web3 = props.web3;
    const [blkInfo, setBlkInfo] = useState({
        number: 0,
        difficulty: 0,
        timeDelta: 0,
        miner: "",
        gasUsed: 0,
        transactions: [],
    });
    const prevBlk = useRef(); // 暂存BLK信息
    const [blkTime, setBlkTime] = useState(0);



    useEffect(() => {
        // 初始化web3
        const web3 = props.web3;

        const init = () => {
            return w3DataInitial(web3).then(() => {
                setW3Subscriber(web3)
            })
        }
        init();
    }, [])

    useEffect(() => {
        // 初始化BLKtimer
        function initTimer() {
            // 初始化UI
            return setInterval(() => {
                setBlkTime(c => c + 1)
            }, 1000)
        }
        const timer = initTimer();
        return function cleanup() {
            clearInterval(timer)
        }
    }, [])


    async function w3DataInitial(w3) {
        // 初始化BLK信息
        return w3.getBlock().then((res) => {
            console.log("block info initial:", res.number);
            res.timeDelta = 0;
            res.gasUsed = res.gasUsed.toNumber();
            setBlkInfo(res)
            prevBlk.current = res;
        }).catch(err => {
            console.log(err);
        })
    }

    async function setW3Subscriber(w3) {
        return w3.on("block", (blockNumber) => {
            console.log('get new blockNumber:', blockNumber);
            w3.getBlock(blockNumber).then((res) => {
                console.log(res);
                res.gasUsed = res.gasUsed.toNumber();
                res.timeDelta = res.timestamp - prevBlk.current.timestamp;
                setBlkInfo(res)
                prevBlk.current = res;
                setBlkTime(0)
            }).catch(err => {
                console.log(err);
            })
        })
    }

    return (
        <Fragment>
            {/* BlockHeight {blkInfo.number}
                <br/>
                Difficulty {blkInfo.difficulty}
                <br/>
                TimeDelta {blkInfo.timeDelta} Sec
                <br/>
                Miner {blkInfo.miner} 
                <br/>
                Last block {blkTime} Sec ago
                <br/>
                Gas used {blkInfo.gasUsed} */}

            <BlockInfoTab blkInfo={blkInfo} blkTime={blkTime} />
        </Fragment>
    );
}

export default W3info;
