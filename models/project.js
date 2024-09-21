'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectSchema = new Schema({
    name: String,
    description: String,
    category: String,
    year: Number,
    langs: String,
    image: String,  
    
}, {versionKey: false});

const ProjectModel = mongoose.model('projects', ProjectSchema);

module.exports = ProjectModel;