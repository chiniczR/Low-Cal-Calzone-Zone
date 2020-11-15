import Baker from "../../assets/images/Baker-amico.png";
import Empty from "../../assets/images/empty.png";

function Kitchen ({stage}) {
    let pic = stage === 'baking' || stage === 'oven' ? Baker : Empty;
    let height = stage === 'baking' || stage === 'oven' ? 450 : 300;
    return (
        <>
            <img src={pic} className="mt-3" alt={stage} height={height} />
            <h5>{stage === 'empty' ? 'Kitchen is empty' : 'Current order (blue) is in stage: ' + stage}</h5>
        </>
    )
};

export default Kitchen;

