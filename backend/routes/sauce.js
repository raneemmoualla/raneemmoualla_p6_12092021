const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucectrl = require('../controllers/sauce');
// routes
router.get('/',auth,saucectrl.getAllSauce);
router.post('/',auth,multer,saucectrl.createSauce);
router.get('/:id',auth,saucectrl.getOneSauce); 
router.put('/:id',auth,multer,saucectrl.modifySauce);
router.delete('/:id',auth,saucectrl.deleteSauce);
  
module.exports = router;