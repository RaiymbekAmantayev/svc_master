const db = require('../models')
const axios = require("axios");
const Monitoring = db.monitoring
const File = db.file
const Users = db.users
const Point = db.points
const Replicas = db.file_replicas
const addMonitoring = async (req, res) => {
    try {
        console.log(req.body.fileId)
        console.log(req.body.typeError)
        const info = {
            fileId: req.body.fileId,
            ReplicasId: req.body.ReplicasId,
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
                },
            ]
        })
        const files = [];
        const Replic = []
        for (const item of monitoring) {
            const file = await File.findByPk(item.fileId);
            const toPoint = await Replicas.findByPk(item.ReplicasId)
            if (file) {
                files.push(file)
            }
            if(toPoint){
                Replic.push(toPoint);
            }
        }

        const users = []
        for (const file of files){
            const user = await Users.findByPk(file.userId)
            if(user){
                users.push(user)
            }
        }
        const points = []
        for(const user of users){
            const point = await Point.findByPk(user.pointId)
            if(point){
                points.push(point)
            }
        }
        const toPoints = []
        for(const rep of Replic){
            const toPoint = await Point.findByPk(rep.pointId)
            if(toPoint){
                toPoints.push(toPoint)
            }
        }
        const response = {
            monitoring: monitoring.map((monitoring, index) => {
                return {
                    monitoring,
                    points: points[index], // Добавляем points
                    toPoints: toPoints[index] // Добавляем toPoints
                };
            })
        };

        return res.send(response)
    }catch (e){
        res.status(500).send({ error: 'Internal Server Error' });

    }
}

const DeleteFileByPath = async (req, res) => {
    try {
        const id = req.params.id;
        const monitoring = await Monitoring.findByPk(id);
        const file = await File.findByPk(monitoring.fileId);
        const filePath = file.file;
        const user = await Users.findByPk(file.userId);
        console.log("userPointId:", user.pointId)
        const point = await Point.findByPk(user.pointId);
        const del = await axios.post(`${point.base_url}/api/file/del`, { filePath: filePath });
        if(del.data === "Файл не найден" || del.data === "Файл успешно удален"){
            await Replicas.destroy({where:{id:monitoring.ReplicasId}})
            await Monitoring.destroy({ where: { fileId: file.id } });
            return res.send("success");
        }
    } catch (e) {
        console.error('Ошибка в DeleteFileByPath:', e);
        return res.status(500).send("Internal Server Error"); // Отправляем текст ошибки
    }
};


module.exports={
    addMonitoring,
    getAll,
    DeleteFileByPath
}