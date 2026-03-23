import { NextFunction, Request, Response } from "express";
import * as equipmentService from "./equipment.service";

export const getAllEquipments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: implement filter
        const { category, status } = req.query;
        const filters: any = {};
        if (category) filters.categoryId = category;
        if (status) filters.status = status;

        const equipments = await equipmentService.getAllEquipments(filters);
        res.status(200).json({ status: "success", data: equipments });
    } catch (error) {
        next(error);
    }
}
