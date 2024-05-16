

module.exports = (sequelize, DataTypes) => {
    const FT = sequelize.define('fundstransfer', {
        code: {
            type: DataTypes.ENUM('DR', 'CR'), // use ENUM to limit the possible values
            allowNull: false,
            defaultValue: 'CR', // set a default value if needed
        },
        name: {
            type: DataTypes.STRING,
            // defaultValue: 1,
        },
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 1,
        },
        rate: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 1,
        },
        closingBalance: {
            type: DataTypes.DOUBLE, // use ISO 4217 currency codes (e.g. USD, EUR, GBP)
            defaultValue: 0, // set a default currency if needed
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        sequelize,
        // don't forget to enable timestamps!
        timestamps: true,
        // I don't want createdAt
        createdAt: true,
        // I want updatedAt to actually be called updateTimestamp
        updatedAt: 'updateTimestamp',
        // disable the modification of tablenames; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,
    })

    return FT;
};

// 1. STRING: A variable length string.
// 2. CHAR: A fixed length string.
// 3. TEXT: A long string.
// 4. INTEGER: A 32-bit integer.
// 5. BIGINT: A 64-bit integer.
// 6. FLOAT: A floating point number.
// 7. DOUBLE: A double floating point number.
// 8. DECIMAL: A fixed-point decimal number.
// 9. BOOLEAN: A boolean value.
// 10. DATE: A date object.
// 11. DATEONLY: A date object without time.
// 12. TIME: A time object.
// 13. UUID: A universally unique identifier.
// 14. ENUM: A value from a predefined list of values.
// 15. ARRAY: An array of values.
// 16. JSON: A JSON object.
// 17. JSONB: A JSON object stored as a binary format.