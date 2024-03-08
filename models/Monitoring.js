module.exports = (sequelize, DataTypes) => {
    const Monitoring = sequelize.define("monitoring", {
        fileId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "files",
                key: "id",
            }
        },
        ReplicasId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "file_replicas",
                key: "id",
            }
        },
        typeError:{
            type: DataTypes.STRING,
            allowNull: true,
        }
    });
    return Monitoring;
};