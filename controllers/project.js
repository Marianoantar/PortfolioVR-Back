// 'use strict';
const express = require('express');
const app = express();
const ProjectModel = require('../models/project'); 
const { default: mongoose } = require('mongoose');
const fs = require('fs');
const path = require('path');
const { strict } = require('assert');


// const multer = require('multer');
// const upload = multer({ dest: './uploads' });


const controller = {};

controller.home = (req, res) => {
    return res.status(200).send({message: 'Soy la Funcion home'})
};

controller.test = (req, res) => {
    return res.status(200).send({message: 'Soy la Funcion test'})
}

controller.saveProject = async(req, res) => {
    try {
        const project = new ProjectModel(req.body);

        // Verifica si existe nombre
        const exists = await ProjectModel.exists({name: project.name});
        if (exists) {
            res.status(400).json({message: 'El proyecto ya existe'});
            return;
        }
        
        await project.save();
        res.status(201).json(project);
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

controller.getProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar el formato del ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404).json({message: 'ID inválido'});
            return};


        // Verificar si existe id y resuelve
        const project = await ProjectModel.findById(id);

        if(project) {
            res.status(200).json(project);
        } else {
            res.status(404).json({message: 'El proyecto no existe'});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

controller.getProjectByName = async (req, res) => {
  try {
    const { name } = req.params;

    const  objeto_id =  await ProjectModel.find({ name }, { limit: 1 });
    if (objeto_id.length > 0) {
        const id = objeto_id[0]._id;
        const project = await ProjectModel.findById(id);
        res.status(200).json(project);
    } else {
        res.status(404).json({ message: "El proyecto no existe" });
    }
  } catch (error) {
    res.status(500).json({ message: 'catch' + error.message });
  }
};

controller.getProjects = async (req, res) => {
    try {
        const allProjects = await ProjectModel.find().sort('year');
        res.status(200).json( allProjects );
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

controller.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = req.body;

        // verificar si es valido ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404).json({message: 'ID inválido'});
            return};
            
        // Verificar si existe id y resuelve
        const exists = await ProjectModel.exists({ _id: id });
        if (exists) {
            await ProjectModel.findByIdAndUpdate(id, project);
            res.status(200).json(project);
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

controller.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        //  Verificar si es valido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404).json({message: 'Invalid ID'})
            }
        // Verificar si existe id y resuelve
        const exists = await ProjectModel.exists({_id: id});
        if (exists) {
            await ProjectModel.findByIdAndDelete(id);
            res.status(200).json({message: 'El Proyecto ha sido borrado'})
        }
    } catch (error) {
        res.status(404).json({message: error.message})        
    }

    };

    // controller.uploadImage = async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const fileName ='Imagen no subida...';

    //         if(req.files) {
    //             const filePath = req.files.image.path;
    //             const fileSplit = filePath.split('\\');
    //             const fileName = fileSplit[1];
             
    //             const exists = await ProjectModel.exists({_id: id});
    //             if (exists) {
    //                 await ProjectModel.findByIdAndUpdate(id, {image: fileName});
    //                 res.status(200).json({
    //                     image: fileName
    //                 });
    //             } else {
    //                 res.status(404).json({message: 'El proyecto no existe'});
    //             };

    //             // return res.status(200).send({
    //             //     files: fileName
    //             // })
    //         }  else {
    //             res.status(200).send({
    //                 message: fileName
    //             })
    //         }
    //     } catch (error) {
    //         res.status(500).json({message: error.message});
    //     }
    // }

    controller.uploadImage = async (req, res) => {
        try {
            const { id } = req.params;

            if (req.file) {
                // 1. Comprobar tipo de archivo
                const allowedTypes = ['image'];
                if (!allowedTypes.includes(req.file.mimetype.split('/')[0])) {
                  fs.unlink(req.file.path, (error) => {
                    if (error) {
                      console.error('Error al eliminar archivo no válido:', error);
                      return res.status(500).json({ message: 'Error interno del servidor' }); // Mensaje genérico para el usuario
                    }
                  });
                  return res.status(400).json({ message: 'El archivo no es una imagen, será eliminado' });
                }
              
                // 2. Comprobar extensiones permitidas
                const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
                const extension = req.file.mimetype.split('/')[1];
                if (!allowedExtensions.includes(extension)) {
                  fs.unlink(req.file.path, (error) => {
                    if (error) {
                      console.error('Error al eliminar archivo no válido:', error);
                      return res.status(500).json({ message: 'Error interno del servidor' });
                    }
                  });
                  return res.status(400).json({ message: 'La extensión del archivo imagen tiene que ser jpg, jpeg, png o gif' });
                }
              
                // Continuar con la lógica de carga de archivo
                const fileName = req.file.filename;
                await ProjectModel.findByIdAndUpdate(id, {image: fileName});
                res.status(200).json({ image: fileName });
              } else {
                // Manejar caso en que no se haya subido ningún archivo
                return res.status(400).json({ message: 'No se ha seleccionado ningún archivo' });
              }
        } catch (error) {
            res.status(501).json({message: error.message});
        }
    };

    controller.getImageFile = async (req, res) => {
        const file = req.params.image;
        console.log(file);
        const path_file = './uploads/' + file;
        console.log(path_file);
        try {
            if (fs.existsSync(path_file)) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(200).send({message: 'El archivo no existe...'});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'error al recuperar imagen'});
        }
        // fs.exists(path_file, (exists) => {
        //     if (exists) {
        //         return res.sendFile(path.resolve(path_file));
        //     } else {
        //         return res.status(200).send({message: 'El archivo no existe...'});
        //     }
        // })
    }


module.exports = controller;