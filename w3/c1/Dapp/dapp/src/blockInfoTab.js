

function BlockInfoTab(props) {

    let TabItem = {
        "BlockHight": [props.blkInfo.number],
        "Difficulty": [props.blkInfo.difficulty],
        "BlkTimeΔ": [props.blkInfo.timeDelta, " s"],
        "Miner": [props.blkInfo.miner],
        "Lastblock": [props.blkTime, " s"],
        "Gas used": [props.blkInfo.gasUsed, " Gwei"],
        "Txs": [(props.blkInfo.transactions === undefined) ? 0 : props.blkInfo.transactions.length],
    }

    return (
        <div className="Block-tab">
            <table style={{"border": "1px solid #ccc"}}>
                <tbody>
                    {Object.keys(TabItem).map((key, index) => {
                        return (
                            <tr key={index} >
                                <td style={{"width":"100px"}}>{key}</td>
                                {(TabItem[key].length ===1)?<td >{TabItem[key][0]}</td>:<td>{TabItem[key][0]}{TabItem[key][1]}</td>}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default BlockInfoTab;