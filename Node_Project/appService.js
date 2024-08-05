const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

// Query type satisfied: SELECTION
async function getAttractions(province, city) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT attractionID, attractionName
             FROM TouristAttractions1 T1, TouristAttractions2 T2
             WHERE T1.latitude = T2.latitude AND T1.longitude = T2.longitude
             AND T1.province = :province AND T1.city = :city`,
            [province, city]
        );
        return result.rows;
    }).catch(() => {
        return [];
    })
}

async function addAttraction(name, description, open, close, lat, long, category, province, city) {

    console.log(name, description, open, close, lat, long, category, province, city);

    // First ensure that the foreign key is present in TouristAttractions1 table
    if (!(await checkTouristAttraction1(lat, long, province, city))) {
        await addTouristAttractions1(lat, long, province, city);
    }

    // Adding to TouristAttractions2
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO TouristAttractions2 (attractionName, attractionDesc, category, openingHour, closingHour, latitude, longitude)
            VALUES(:attractionName, :attractionDesc, :category, :openingHour, :closingHour, :latitude, :longitude)`,
            [name, description, category, open, close, lat, long],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.log(err);
        return false;
    })
}

// Check that the touristattraction1 exists
async function checkTouristAttraction1(lat, long, province, city) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT *
            FROM TouristAttractions1
            WHERE latitude = :latitude AND longitude = :longitude AND 
            province = :province AND city = :city`,
            [lat, long, province, city]
        );
        console.log(result.rows.length > 0);
        return (result.rows.length > 0);
    }).catch((err) => {
        console.log(err);
        return false;
    })
}

// Check that the touristattraction1 exists
async function checkTouristAttraction2(attractionID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT *
            FROM TouristAttractions2
            WHERE attractionID = :id`,
            [attractionID]
        );
        console.log(result.rows.length > 0);
        return (result.rows.length > 0);
    }).catch((err) => {
        console.log(err);
        return false;
    })
}

async function addTouristAttractions1(lat, long, province, city) {
    // Ensure that province and city exist in Locations
    if (!(await checkLocation(province, city))) {
        await addLocation(province, city);
    }

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO TouristAttractions1
            VALUES(:latitude, :longitude, :province, :city)`,
            [lat, long, province, city],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.log(err);
        return false;
    })
}

// Check that the location exists
async function checkLocation(province, city) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT *
            FROM Locations
            WHERE province = :province AND city = :city`,
            [province, city]
        );
        console.log(result.rows.length > 0);
        return (result.rows.length > 0);
    }).catch((err) => {
        console.log(err);
        return false;
    })
}

async function addLocation(province, city) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Locations
            VALUES(:province, :city)`,
            [province, city],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.log(err);
        return false;
    })
}

async function deleteAttraction(attractionID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM TouristAttractions2
            WHERE attractionID = :attractionID`,
            [attractionID],
            { autoCommit: true }
        );
        return (result.rowsAffected && result.rowsAffected > 0);
    }).catch((err) => {
        return false;
    })
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function projectExperienceAttributes(id, toSelect) {
    return await withOracleDB(async (connection) => {

        //Pre defined hash_set to prevent sql injections in O(1) time
        selectorSet = new Set(['experienceID', 'experienceName', 'experienceDesc', 'company', 'price']);

        //Check
        toSelect.forEach(option => {
            if (!selectorSet.has(option)) {
                throw new Error(`Potential SQL Injection`);
            }
        });

        let parsedSelectorString = toSelect.join(', ');

        const query = `
        SELECT ${parsedSelectorString} 
        FROM ExperienceOffered
        WHERE attractionID = :id
        `;

        try {
            const result = await connection.execute(
                query,
                [id]
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    })
}


async function countAttractionsByCityAndProvince(province, city) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT COUNT(*) AS attractionCount
            FROM TouristAttractions1
            WHERE province = :province AND city = :city`,
            [province, city]
        );
        console.log(result);
        return result.rows;
    }).catch(() => {
        return [];
    })
}

// async function countAttractionsHaving(province, city, minCount) {
//     return await withOracleDB(async (connection) => {
//         const query = `
//         SELECT city, province, COUNT(*) AS attractionCount
//         FROM attractions
//         WHERE province = :province AND city = :city
//         GROUP BY city, province
//         HAVING COUNT(*) > :minCount;
//     `;
//         const binds = { province: province, city: city, minCount: minCount };

//         try {
//             const result = await connection.execute(query, binds);
//             return result.rows;
//         } catch (error) {
//             console.error('Error counting attractions with HAVING clause:', error);
//             return null;
//         }
//     })
// }

async function countAttractionsHaving() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT province, city
            FROM TouristAttractions1
            GROUP BY city, province
            HAVING COUNT(*) > 2`
        );
        console.log(result.rows)
        return result.rows;
    }).catch(() => {
        return [];
    })
}

async function getAvgAttractionsPerProvince() {
    return await withOracleDB(async (connection) => {
        const query = `
        SELECT AVG(attractionCount) AS avgAttractionCount
        FROM (
            SELECT province, COUNT(*) AS attractionCount
            FROM TouristAttractions1
            GROUP BY province
        )
         `;
        try {
            const result = await connection.execute(query);
            return result.rows;
        } catch (error) {
            console.error('Error getting average attractions per province:', error);
            return null;
        }
    })
}

async function applyPriceFilters(price, comparison) {
    return await withOracleDB(async (connection) => {
        let query;

        if (comparison == 'equals') {
            query =
                `SELECT experienceID, experienceName, price 
            FROM ExperienceOffered 
            WHERE price = :price`;
        } else if (comparison == 'larger') {
            query =
                `SELECT experienceID, experienceName, price 
            FROM ExperienceOffered 
            WHERE price >= :price`;
        } else if (comparison == 'smaller') {
            query =
                `SELECT experienceID, experienceName, price 
            FROM ExperienceOffered 
            WHERE price <= :price`;
        }

        try {
            const result = await connection.execute(
                query,
                [price]
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    })
}

// Query type satisfied: Division
async function findCompletionist(attractionID) {
    // First ensure that the attraction exists, otherwise division will result in every user
    const result = await checkTouristAttraction2(attractionID);

    if (!result) {
        return [];
    }

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT userID, userName
            FROM UserProfile U
            WHERE NOT EXISTS 
                ((SELECT E.experienceID
                FROM ExperienceOffered E
                WHERE attractionID = :id)
                MINUS (SELECT B.experienceID
                    FROM Booking2 B
                    WHERE B.userID = U.userID))`,
            [attractionID]
        );
        console.log(result);
        return result.rows;
    }).catch(() => {
        return [];
    })
}

module.exports = {
    testOracleConnection,
    getAttractions,
    addAttraction,
    deleteAttraction,
    projectExperienceAttributes,
    fetchDemotableFromDb,
    insertDemotable,
    updateNameDemotable,
    countDemotable,
    applyPriceFilters,
    countAttractionsByCityAndProvince,
    countAttractionsHaving,
    getAvgAttractionsPerProvince,
    findCompletionist
};