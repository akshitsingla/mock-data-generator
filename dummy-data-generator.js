// LIBRARIES IMPORT
const fs = require('fs');

// ENVIRONMENT CONTROLS
ID_LENGTH = 10;
INCENTIVE_CATEGORIES = ["low", "medium", "high"];
TASK_TYPES = ["task_1", "task_2", "task_3"];
MIN_TRAINING_HOURS = [0, 0, 0];
MAX_TRAINING_HOURS = [10, 20, 30];
MIN_TASK_COUNT = [0, 0, 0];
MAX_TASK_COUNT = [1000, 4200, 100];
MIN_MINUTES_SINGLE_TASK = [0, 0, 0];
MAX_MINUTES_SINGLE_TASK = [2, 2, 3];
MIN_ACCURACY = [0, 0, 0];
MAX_ACCURACY = [100, 100, 100];
APP_INITIALIZATION_TIMESTAMP = new Date(2020, 05, 27);
DATA_GENERATION_TIMESTAMP = new Date();
PLACEHOLDER_FOR_MISSING_DATA = "UNKNOWN"


// UTIILITIES - RANDOMNESS
const generateRandomValueOfType = function(type, lower_limit, upper_limit) {
    switch(type) {
        case "NUMBER": {
            return Math.floor(Math.random() * (upper_limit - lower_limit + 1) ) + lower_limit;
        }
        case "ID": {
            var id = "";
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            for ( var i = 0; i < ID_LENGTH; i++ ) {
                id += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return id;
        }
        case "TIMESTAMP": {
            return new Date(lower_limit.getTime() + Math.random() * (upper_limit.getTime() - lower_limit.getTime()));
        }
        case "INCENTIVE_CATEGORY": {
            return INCENTIVE_CATEGORIES[Math.floor(Math.random() * 10) % INCENTIVE_CATEGORIES.length];
        }
    }
};

// UTILITIES - CSV
const writeCSV = function(csv_text, file_name) {
    fs.writeFile(file_name, csv_text, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

const generateCSV = function(data) {
    var csv_text = "";
    switch(typeof data) {
        case "string": 
        case "number":
        case "boolean": {
            csv_text += data + ",";
            break;
        }
        case "object": {
            // Date
            if (data.constructor.toString().indexOf("Date") > -1) {
                csv_text += data.toString() + ",";
            }
            // Array
            else if (data.constructor.toString().indexOf("Array") > -1) {
                csv_text += generateCSVFromArray(data) + ",";
            } 
            // Object
            else {
                csv_text += generateCSVFromObject(data) + ",";
            }
            // String
            // Number
            // Boolean
            // null
            // undefined
            break;
        }
    }
    return csv_text;
};

const generateCSVFromArray = function(data) {
    var csv_text = "";
    for (var i=0; i<data.length; i++) {
        csv_text += generateCSV(data[i]);
        // HARDCODE - USER_LEVEL entities
        if (data[i]["user_id"]) {
            csv_text += "\n";
        } else {
            csv_text = csv_text.substr(0, csv_text.length - 1);
        }
    }
    return csv_text;
};

const generateCSVFromObject = function(data) {
    var csv_text = "";
    dataHeaders = Object.getOwnPropertyNames(data);
    for (var j=0; j<dataHeaders.length; j++) {
        csv_text += generateCSV(data[dataHeaders[j]]);
    }
    return csv_text;
};

// MODEL FACTORIES
const modelFactories = {
    sarah: {
        generate : function() {
            var user_tasks_training = [];

            for (var i=0;i<TASK_TYPES.length; i++) {
                user_tasks_training.push({
                    training_to_date_hrs: generateRandomValueOfType("NUMBER", MIN_TRAINING_HOURS[i], MAX_TRAINING_HOURS[i]),
                    experience_task_count: generateRandomValueOfType("NUMBER", MIN_TASK_COUNT[i], MAX_TASK_COUNT[i]),
                    experience_hrs: generateRandomValueOfType("NUMBER", MIN_MINUTES_SINGLE_TASK[i], MAX_MINUTES_SINGLE_TASK[i]),
                    avg_accuracy_to_date: generateRandomValueOfType("NUMBER", MIN_ACCURACY[i], MAX_ACCURACY[i]),
                    incentive_category: generateRandomValueOfType("INCENTIVE_CATEGORY")
                });
            }

            return {
                user_id: generateRandomValueOfType("ID"),
                joining_timestamp: generateRandomValueOfType("TIMESTAMP", APP_INITIALIZATION_TIMESTAMP, DATA_GENERATION_TIMESTAMP),
                tasks: user_tasks_training
            };
        }
    }
}

// FACTORY OBJECT PROVIDER
const getFactory = function(modelName) {
    return modelFactories[modelName];
}

// DUMMY DATA GENERATOR
generateDummyData = function(modelName, number_of_entries) {
    dataHolder = [];
    const dataFactory = getFactory(modelName);
    for (var i=0; i<number_of_entries; i++) {
        dataHolder.push(dataFactory.generate());
    }
    return dataHolder;
}

// MAIN
dummy_data = generateDummyData("sarah", 1000);
csv_text = generateCSV(dummy_data);
writeCSV(csv_text, "./dummy_data.csv");
