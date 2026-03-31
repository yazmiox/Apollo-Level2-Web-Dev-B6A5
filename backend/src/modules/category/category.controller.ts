import { Request, Response, NextFunction } from "express";
import * as categoryService from "./category.service";

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { q } = req.query;
        const categories = await categoryService.getAllCategories(q as string);
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
}

export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;
        const category = await categoryService.getCategoryBySlug(slug as string);
        if (!category) {
            return res.status(404).json({ status: "error", message: "Category not found" });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
}

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // You should validate input data and handle roles here (e.g., admin check)
        const category = await categoryService.createCategory(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
}

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const category = await categoryService.updateCategory(id as string, req.body);
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await categoryService.deleteCategory(id as string);
        res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        next(error);
    }
}
