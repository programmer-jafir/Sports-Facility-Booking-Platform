import express from 'express';
import validateRequest from '../../middlwares/validateRequest';
import { FacilityValidations } from './facility.validation';
import { FacultyControllers } from './facility.controller';
import auth from '../../middlwares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
    '/',
    auth(USER_ROLE.admin),
    validateRequest(
        FacilityValidations.createFacilityValidationSchema
    ),
    FacultyControllers.createFacility
);
router.get(
    '/',
    FacultyControllers.getAllFacility
);
router.get("/:id", FacultyControllers.getSingleFacility);
router.put(
    '/:id',
    auth(USER_ROLE.admin),
    validateRequest(
        FacilityValidations.updateFacilityValidationSchema
    ),
    FacultyControllers.updateFacility
);

router.delete(
    '/:id',
    auth(USER_ROLE.admin),
    FacultyControllers.deleteFacility
);
export const FacilityRoutes = router;