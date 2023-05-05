const { User } = require("../models/user");
const { TaskLog } = require("../models/log");

const createLog = async (taskId, content, adderToken) => {
    const adderId = await getAdderId(adderToken);
    const logid = await getNextLogId();

    const newLog = new TaskLog({
        logid: logid,
        taskid: taskId,
        content,
        adderid: adderId
    })

    const log = await newLog.save();

    return log;
}



module.exports = {
    createLog
};


const getAdderId = async (adderToken) => {
    try {
        const adder = await User.findOne({ authorizationtoken: adderToken });
        return adder.userid;
    } catch (err) {
        console.error(err.message);
        throw new Error('Error while fetching the adder id');
    }
};

const getNextLogId = async () => {
    try {
        const largestLog = await TaskLog.findOne().sort({ logid: -1 });
        console.log("logNum:" + largestLog);
        if (largestLog) {
            return (parseInt(largestLog.logid) + 1).toString();
        } else {
            return "1";
        }
    } catch (err) {
        console.error(err.message);
        throw new Error('Error while fetching the largest logid');
    }
};

