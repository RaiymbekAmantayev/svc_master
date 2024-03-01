const db = require('../models')
const Replicas = db.file_replicas;
const File = db.file;
const Point = db.points;
const Show = async (req, res) => {
    try {
        const point = await Point.findOne({ where: { base_url: `http://127.0.0.1:${config.port}` } });
        const replicase = await Replicas.findAll({
            include: [
                {
                    model: File,
                    as: "files"
                },
                {
                    model: Point,
                    as: "points"
                }
            ]
        });

        const filteredReplicase = replicase.filter(rep => rep.pointId === point.id);

        res.send(filteredReplicase);
    } catch (error) {
        console.error('Error in Show function:', error);
        res.status(500).send('Internal Server Error');
    }
};

const ShowByDocId = async (req, res) => {
    try {
        const documentId = req.query.documentId;
        const files = await File.findAll({where:{documentId:documentId}})
        const fileIds = files.map(file => file.id);
        const point = await Point.findOne({ where: { base_url: `http://127.0.0.1:${config.port}` } });
        const replicase = await Replicas.findAll({
            where: {
                fileId: {
                    [Op.in]: fileIds
                }
            },
            include: [
                {
                    model: File,
                    as: "files"
                },
                {
                    model: Point,
                    as: "points"
                }
            ]
        });
        const filteredReplicase = replicase.filter(rep => rep.pointId === point.id);

        res.send(filteredReplicase);
    } catch (error) {
        console.error('Error in Show function:', error);
        res.status(500).send('Internal Server Error');
    }
};

const addReplicInfoToDb = async (req, res)=>{
    try {
        const info = {
            fileId: req.body.fileId,
            pointId:req.body.pointId,
            status: "waiting"
        }
        const promises = []
        promises.push(Replicas.create(info))
        const newFile = await Promise.all(promises);
        return res.status(200).send(newFile);
    }catch (e){
        return res.status(500).send("error ",e)
    }
}

const getWaitingRep = async (req, res)=>{
    try{
        const replicas = await Replicas.findAll({
            where: { status: 'waiting' },
            limit: 10
        })
        if (!replicas.length) {
            return res.send("replic not found")
        }
        return res.send(replicas)
    }catch (e){
        console.log(e)
        return res.status(500).send("error",e)
    }
}

const updateToReady = async (req, res)=>{
    try{
        const id = req.params.id
        const newRep = await Replicas.update({ status: 'ready' }, { where: { id:id } })
        if(newRep === 1){
            return res.status(200).send("success")
        }
        return res.status(404).send("fail")
    }catch (e){

    }
}


module.exports={
    addReplicInfoToDb,
    Show,
    ShowByDocId,
    getWaitingRep,
    updateToReady
}