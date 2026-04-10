import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import * as equipmentService from "./equipment.service";

export const getAllEquipments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters: any = {};
        const { q, category, status, sort, page, limit, isFeatured, vendorId } = req.query;

        if (q) filters.q = q;
        if (category) filters.category = category;
        if (status) filters.status = status;
        if (sort) filters.sort = sort;
        if (page) filters.page = page;
        if (limit) filters.limit = limit;
        if (isFeatured) filters.isFeatured = isFeatured === "true";
        if (vendorId) filters.vendorId = vendorId;

        const equipments = await equipmentService.getAllEquipments(filters);
        res.status(200).json({ success: true, message: "Equipments fetched successfully", ...equipments });
    } catch (error) {
        next(error);
    }
}

export const getEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;
        const equipment = await equipmentService.getEquipmentBySlug(slug as string);
        res.status(200).json({ success: true, message: "Equipment fetched successfully", data: equipment });
    } catch (error) {
        next(error);
    }
}

export const createEquipmentImageUploadUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await equipmentService.createEquipmentImageUpload(req.body);
        res.status(200).json({ success: true, message: "Image upload URL created successfully", data: result });
    } catch (error) {
        next(error);
    }
};

export const createEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // If vendor, auto-attach their ID; admin can optionally specify a vendorId
        const vendorId = req.user?.role === "vendor" ? req.user.id : req.body.vendorId || null;
        const equipment = await equipmentService.createEquipment({ ...req.body, vendorId });
        res.status(201).json({ success: true, message: "Equipment created successfully", data: equipment });
    } catch (error) {
        next(error);
    }
}

export const updateEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        // Vendors can only update their own equipment
        if (req.user?.role === "vendor") {
            await equipmentService.ensureVendorOwnership(id, req.user.id);
        }
        const equipment = await equipmentService.updateEquipment(id as string, req.body);
        res.status(200).json({ success: true, message: "Equipment updated successfully", data: equipment });
    } catch (error) {
        next(error);
    }
}

export const deleteEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        // Vendors can only delete their own equipment
        if (req.user?.role === "vendor") {
            await equipmentService.ensureVendorOwnership(id, req.user.id);
        }
        await equipmentService.deleteEquipment(id as string);
        res.status(200).json({ success: true, message: "Equipment deleted successfully", data: null });
    } catch (error) {
        next(error);
    }
}

// Vendor-specific: get only my listings
export const getMyEquipments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters: any = { vendorId: req.user!.id };
        const { q, status, page, limit } = req.query;

        if (q) filters.q = q;
        if (status) filters.status = status;
        if (page) filters.page = page;
        if (limit) filters.limit = limit;

        const equipments = await equipmentService.getAllEquipments(filters);
        res.status(200).json({ success: true, message: "Vendor equipments fetched successfully", ...equipments });
    } catch (error) {
        next(error);
    }
}
