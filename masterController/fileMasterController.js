const db = require("../models");
const File = db.file;
const Compress = db.compressing
const Point = db.points
const axios = require('axios'); // Подключаем библиотеку для отправки HTTP-запросов
const multer = require('multer');
const upload = multer(); // Создаем multer middleware без параметров, чтобы принимать все файлы
const FormData = require('form-data');
const {query} = require("express");
const {Sequelize} = require("sequelize");

const getPoint = async (req, res) => {
    try {
        const user = req.user;
        const userPoint = await Point.findByPk(user.pointId);
        const base_url = userPoint.base_url;
        return res.send(base_url)
    } catch (error) {
        res.status(500).send(error.message);
    }
};




const addFileToDb = async (req, res) => {
    try {
        console.log(req.body.name)
        console.log(req.body.file)
        console.log(req.body.userId)
        console.log(req.body.documentId)
        console.log(req.body.mimeType)
        const info = {
            name: req.body.name,
            file: req.body.file,
            userId: req.body.userId,
            documentId: req.body.documentId,
            mimeType: req.body.mimeType,
            compressed: 0
        };

        // Создаем массив обещаний для операции создания файла
        const promises = [];

        // Добавляем обещание в массив
        promises.push(File.create(info));

        // Ожидаем завершения операции создания файла
        const newFile = await Promise.all(promises);

        // Отправляем результат клиенту
        return res.status(200).send(newFile);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};



const addCompressing = async (req, res) => {
    try {
        // Получаем информацию из запроса
        const { fileId, compressingStatus } = req.body;

        // Создаем массив обещаний для операций создания
        const promises = [];

        // Добавляем обещание в массив для каждой записи, которую нужно создать
        promises.push(Compress.create({fileId: fileId, compressingStatus:compressingStatus}));

        // Ждем завершения всех операций создания с помощью Promise.all()
        const newCompressions = await Promise.all(promises);

        // Отправляем созданные записи клиенту
        return res.send(newCompressions);
    } catch (error) {
        // Если возникла ошибка, отправляем ее клиенту
        console.error(error);
        return res.status(500).send("Ошибка сервера");
    }
};

const getCompressing = async (req, res)=>{
    try{
        const fileId = req.query.fileId
        const compressing = await Compress.findOne({where:{fileId:fileId}})
        return res.send(compressing)
    }catch (e){
        return res.status(500).send("error", e)
    }
}

const isExists = async (req, res) => {
    try {
        const fileId = req.query.fileId;
        const compressingStatus = req.query.compressingStatus;
        const compress = await Compress.findOne({ where: { fileId: fileId, compressingStatus: compressingStatus } });

        if (!compress) {
            return res.send("file not found");
        }

        return res.send(compress);
    } catch (e) {
        console.error(e);
        return res.status(500).send("Internal Server Error");
    }
};


const getAllLocalFiles = async (req, res) => {
    try {
        const localFiles = await File.findAll({
            where: {
                file: {
                    [Sequelize.Op.like]: `${config.folder}%`,
                },
            },
        });
        res.send( localFiles );
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const ShowAll = async (req, res) => {
    try {
        const files = await File.findAll({
            include: [
                {
                    model: User,
                    as: "user"
                },
            ],
        });
        res.status(200).send(files);
    } catch (err) {
        res.status(500).send("Ошибка при получении данных");
    }
};
const getFilesByDocument = async (req, res)=>{
    try{
        const documentId = req.query.documentId
        const files = await File.findAll({where:{documentId:documentId}})
        if (files) {
            res.status(200).send(files);
        } else {
            res.status(404).send("файл не найден");
        }
    }catch (err){
        res.status(500).send("Ошибка при получении данных");
    }
}

const getDocuments = async (req, res)=>{
    const user = req.user
    const point = await Point.findByPk(user.pointId)
    const distinctDocumentIds = await File.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('documentId')), 'documentId'],
        ],
        where: {
            file: {
                [Sequelize.Op.like]: `${point.root_folder}%`,
            },
        },
    });
    res.send(distinctDocumentIds)
}

const LastFile = async (req, res)=>{
    const file = await File.findOne({ order: [['id', 'DESC']] });
    res.send(file)
}

const getFileById = async (req, res) => {
    try {
        const ids = req.params.id.split(','); // Assuming IDs are provided as a comma-separated string
        const files = await Promise.all(ids.map(async (id) => {
            const file = await File.findByPk(id);
            return file;
        }));

        res.send(files);
    } catch (error) {
        console.error('Error retrieving files by IDs:', error);
        res.status(500).send('Internal Server Error');
    }
};


const updateCompressedByPath = async (req, res)=>{
    try{
        const filePath = req.query.filePath
        const newFile = await File.update({ compressed: 1 }, { where: { file:filePath } })
        return res.status(200).send(newFile)
    }catch (e){
        return res.status(500).send("error", e)
    }
}


const fileById = async (req, res)=>{
    try{
        const id = req.params.id
        const file = await File.findByPk(id)
        return res.status(200).send(file)
    }catch (e){
        console.log(e)
        return res.status(500).send("error", e)
    }
}


const LastId = async (req, res) => {
    try {
        const files = await File.findOne({
            order: [['id', 'DESC']], // Сортируем по убыванию ID
            limit: 1 // Устанавливаем лимит выборки одной записи
        });
        if(!files){
            console.log("file not found")
        }
        console.log(files)
        res.send(files); // Отправляем найденную запись
    } catch (error) {
        console.error(error);
        res.status(500).send("Ошибка при выполнении запроса");
    }
}



module.exports={
    addFileToDb,
    addCompressing,
    isExists,
    getPoint,
    getFilesByDocument,
    getDocuments,
    LastFile,
    getFileById,
    getAllLocalFiles,
    ShowAll,
    updateCompressedByPath,
    fileById,
    LastId,
    getCompressing
}
