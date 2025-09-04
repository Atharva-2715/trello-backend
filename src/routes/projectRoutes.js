const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization');
const project = require('../models/projectModel');
const e = require('express');
const mongoose = require('mongoose');

//create a project
router.post('/create', auth, async (req, res) => {
    try {
      const { name, description } = req.body;
  
      const newProject = new project({
        name,
        description,
        
        owner: req.user.id   
      });
  
      await newProject.save();
      res.status(201).json({ message: "Project created successfully", project: newProject });
    } catch (err) {
      res.status(500).json({ message: "Error creating project", error: err.message });
    }
});

//get all projects
router.get('/',auth, async(req,res)=>{
    try{
        const projects = await project.find({owner : req.user.id})
        res.json(projects);
    }catch(err){
        res.status(500).json({message:"Error fetching projects.", error : err.message})
    }
})  

//create a single project
router.get('/:id', auth, async (req, res) => {
  try {
    console.log("Requested ID:", req.params.id);
    console.log("User from token:", req.user);

    const Project = await project.findOne({ _id: req.params.id, owner: req.user.id });
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(Project);
  } catch (err) {
    console.error("❌ Error fetching project:", err.message);
    res.status(500).json({ message: "Error fetching project", error: err.message });
  }
});

//update a project
router.put("/:id",auth,async(req,res)=>{
    try{
        const {name,description} = req.body;
        const updateData = {};
        if(name){
            updateData.name = name;
        }
        if(description){
            updateData.description = description;
        }

        const updateProject = await project.findOneAndUpdate({_id: req.params.id, owner: req.user.id},
            updateData,
            {new:true}
        );

        if(!updateProject){
            return res.status(404).json({message:"project not found or not authorized."});
        }

        res.json({
            message: "Project updated successfully",
            project: updateProject
          });

    }
    catch(err){
        res.status(500).json({message : "Error fetching project", error : err.message});
    }
})

//delete a project
router.delete('/:id',auth,async(req,res)=>{
    try{

        const {id} = req.params;
        const deleteProject = await project.findOneAndDelete({_id: req.params.id, owner: req.user.id});
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid project ID" });
          }
      
        if(!deleteProject){
            return res.status(404).json({message:"Project not found."})
        }

        res.json({
            message:"Project deleted successfully.",
            project: deleteProject
        })
    }catch(err){
        res.status(500).json({message:"Error deleting project", error:err.message});
    }
})

module.exports = router;