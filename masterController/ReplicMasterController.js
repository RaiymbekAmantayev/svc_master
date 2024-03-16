const db = require('../models')
const {Op} = require("sequelize");
const axios = require("axios");
const Replicas = db.file_replicas;
const File = db.file;
const Point = db.points;
const Monitoring =db.monitoring
const Users = db.users
config={
    port:  process.env.PORT
}

const ShowByDocId = async (req, res) => {
    try {
        const pointId = req.user.pointId;
        console.log(pointId)
        const documentId = req.query.documentId;
        const files = await File.findAll({ where: { documentId: documentId } });
        const fileIds = files.map(file => file.id);
        const url = await Point.findByPk(pointId);
        const point = await Point.findOne({ where: { base_url: url.base_url } });
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

        const remoteFiles = await Promise.all(filteredReplicase.map(async rep => {
            try {
                const fileFiles = files.map(file => file.file);
                const response = await axios.post(`$${url.base_url}/api/file/show`, fileFiles);
                return response.data;
            } catch (error) {
                console.error('Error fetching file:', error);
                return null; // Если произошла ошибка при получении файла, возвращаем null
            }
        }));
        res.send(remoteFiles);
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
        return res.status(500).send("error", e)
    }
}
const updateToError =async (req, res)=>{
    try{
        const id = req.params.id
        const newRep = await Replicas.update({ status: 'error' }, { where: { id:id } })
        if(newRep === 1){
            return res.status(200).send("success")
        }
        return res.status(404).send("fail")
    }catch (e){
        return res.status(500).send("error", e)
    }
}

const updateToWaiting =async (req, res)=>{
    try{
        const id = req.params.id
        const monitoring = await Monitoring.findByPk(id)
        await Replicas.update({ status: 'waiting' }, { where: { id:monitoring.ReplicasId } })
        await Monitoring.destroy({where:{id:id}})
        return res.status(200).send("success")
    }catch (e){
        return res.status(500).send("error", e)
    }
}

module.exports={
    addReplicInfoToDb,
    ShowByDocId,
    getWaitingRep,
    updateToReady,
    updateToError,
    updateToWaiting
}