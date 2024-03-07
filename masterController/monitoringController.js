const db = require('../models')
const Monitoring = db.monitoring
const File = db.file

const addMonitoring = async (req, res) => {
    try {
        console.log(req.body.fileId)
        console.log(req.body.typeError)
        const info = {
            fileId: req.body.fileId,
            typeError: req.body.typeError
        };

        const promises = []
        promises.push(Monitoring.create(info))
        const newMon = await Promise.all(promises);
        return res.status(200).send(newMon);
    } catch (error) {
        console.error('Ошибка в addMonitoring:', error);
        return res.status(500).send("Ошибка сервера");
    }
};

const getAll = async (req, res)=>{
    try{
        const monitoring = await Monitoring.findAll({
            include:[
                {
                    model:File,
                    as: 'file'
                }
            ]
        })
        return res.send(monitoring)
    }catch (e){
        return res.status(500).send("error", e)
    }
}
module.exports={
    addMonitoring,
    getAll
}