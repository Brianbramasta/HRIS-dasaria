// Barrel re-exports: pisahkan per fitur dan ekspor ulang dengan alias
export { businessLinesService } from './request/business-lines.service';
export { businessLinesService as businessLineService } from './request/business-lines.service';

export { companiesService } from './request/companies.service';
export { companiesService as companyService } from './request/companies.service';

export { officesService } from './request/offices.service';
export { officesService as officeService } from './request/offices.service';

export { directoratesService } from './request/directorates.service';
export { directoratesService as directorateService } from './request/directorates.service';

export { divisionsService } from './request/divisions.service';
export { divisionsService as divisionService } from './request/divisions.service';

export { departmentsService } from './request/departments.service';
export { departmentsService as departmentService } from './request/departments.service';

export { positionsService } from './request/positions.service';
export { positionsService as positionService } from './request/positions.service';

export { employeePositionsService } from './request/employee-positions.service';
export { employeePositionsService as employeePositionService } from './request/employee-positions.service';