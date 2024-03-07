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
        typeError:{
            type: DataTypes.STRING,
            allowNull: true,
        }
    });
    return Monitoring;
};