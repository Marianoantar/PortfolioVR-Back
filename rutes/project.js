'use strict';

const express = require('express');
const ProjectController = require('../controllers/project');

const router = express.Router();

// const multipart = require('connect-multiparty');
// const multipartMiddleware = multipart({ uploadDir: './uploads' });

const multer = require('multer');
// Configurar el almacenamiento de Multer
const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
// const upload = multer({ dest: './uploads' });
const upload = multer({ storage: storage });

router.get('/home', ProjectController.home);
router.post('/test', ProjectController.test);
router.post('/save-project', ProjectController.saveProject);
router.get('/project/:id', ProjectController.getProject);
router.get('/projectByName/:name', ProjectController.getProjectByName);
router.get('/projects', ProjectController.getProjects);
router.put('/project/:id', ProjectController.updateProject);
router.delete('/project/:id', ProjectController.deleteProject);
// router.post('/upload-image/:id', multipartMiddleware, ProjectController.uploadImage);
router.post('/upload-image/:id', upload.single('image'), ProjectController.uploadImage);
router.get('/get-image/:image', ProjectController.getImageFile);


module.exports = router;
