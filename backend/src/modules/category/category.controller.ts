import { Request, Response, NextFunction } from "express";
import * as categoryService from "./category.service";

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { q } = req.query;
        const categories = await categoryService.getAllCategories(q as string);
        res.status(200).json({ success: true, message: "Categories fetched successfully", data: categories });
    } catch (error) {
        next(error);
    }
}

export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;
        const category = await categoryService.getCategoryBySlug(slug as string);
        res.status(200).json({ success: true, message: "Category fetched successfully", data: category });
    } catch (error) {
        next(error);
    }
}

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json({ success: true, message: "Category created successfully", data: category });
    } catch (error) {
        next(error);
    }
}

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const category = await categoryService.updateCategory(id as string, req.body);
        res.status(200).json({ success: true, message: "Category updated successfully", data: category });
    } catch (error) {
        next(error);
    }
}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await categoryService.deleteCategory(id as string);
        res.status(200).json({ success: true, message: "Category deleted successfully", data: null });
    } catch (error) {
        next(error);
    }
}
