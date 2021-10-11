import express, { Router } from "express";
import {registry} from '../controllers/registry';

const router = Router();

router.post('/register', registry);