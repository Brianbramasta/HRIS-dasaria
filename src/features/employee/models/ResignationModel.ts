import {
  ResignationApplicationListItem,
  ResignationDetails,
  ResignationDocumentItem,
  ResignationApplicationDetailResult,
  ResignationAdministrationListItem,
  ResignationAdministrationDetails,
  ResignationAdministrationDetailResult,
  AdministrationPopupResult,
  DocumentTypeItem,
  ContractEndStatusItem,
} from '../types/dto/ResignationType';
import {
  ResignationApplicationEntity,
  ResignationDetailsEntity,
  ResignationDocumentEntity,
  ResignationApplicationDetailEntity,
  ResignationAdministrationEntity,
  ResignationAdministrationDetailsEntity,
  ResignationAdministrationDetailEntity,
  AdministrationPopupEntity,
  DocumentTypeEntity,
  ContractEndStatusEntity,
  ResignationApplicationListEntity,
  ResignationAdministrationListEntity,
  EmployeeOptionEntity,
  ContractEndStatusOptionEntity,
} from '../types/entity/ResignationEntity';

/**
 * Model layer for transforming Resignation API data to internal application format
 * Following clean architecture principles - this is the ONLY place where API transformation happens
 */
export class ResignationModel {
  // --- Applications ---
  static transformApplicationFromApi(dto: ResignationApplicationListItem): ResignationApplicationEntity {
    return {
      application_id: dto.application_id,
      employee_id: dto.employee_id,
      full_name: dto.full_name,
      tanggal_pengajuan: dto.tanggal_pengajuan,
      efektif_resign_date: dto.efektif_resign_date,
      position_name: dto.position_name,
      note_hr: dto.note_hr,
      status_name: dto.status_name,
      jenis_pengajuan: dto.jenis_pengajuan,
    };
  }

  static transformApplicationListFromApi(dtoList: ResignationApplicationListItem[]): ResignationApplicationEntity[] {
    return dtoList.map(item => this.transformApplicationFromApi(item));
  }

  static transformApplicationListWithPagination(
    dtoList: ResignationApplicationListItem[],
    currentPage: number,
    perPage: number,
    total: number
  ): ResignationApplicationListEntity {
    return {
      data: this.transformApplicationListFromApi(dtoList),
      pagination: {
        current_page: currentPage,
        per_page: perPage,
        total,
      },
    };
  }

  static transformDetailsFromApi(dto: ResignationDetails): ResignationDetailsEntity {
    return {
      resignation_id: dto.resignation_id,
      full_name: dto.full_name,
      NIP: dto.NIP,
      position_name: dto.position_name,
      tanggal_pengajuan: dto.tanggal_pengajuan,
      jenis_kontrak: dto.jenis_kontrak,
      contract_end_date: dto.contract_end_date,
      contract_start_date: dto.contract_start_date,
      resignation_reason: dto.resignation_reason,
      document_lampiran: dto.document_lampiran,
      status_name: dto.status_name,
      file_contract: dto.file_contract,
      sisa_kontrak_bulan: dto.sisa_kontrak_bulan,
      surat_komitmen_pelunasan: dto.surat_komitmen_pelunasan,
      letter_of_commitment: dto.letter_of_commitment,
    };
  }

  static transformDocumentFromApi(dto: ResignationDocumentItem): ResignationDocumentEntity {
    return {
      id: dto.id,
      resignation_id: dto.resignation_id,
      termination_administrative_id: dto.termination_administrative_id,
      document_type_id: dto.document_type_id,
      document_name: dto.document_name,
      document_path: dto.document_path,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
      file_type_name: dto.file_type_name,
    };
  }

  static transformDocumentListFromApi(dtoList: ResignationDocumentItem[]): ResignationDocumentEntity[] {
    return dtoList.map(item => this.transformDocumentFromApi(item));
  }

  static transformApplicationDetailFromApi(dto: ResignationApplicationDetailResult): ResignationApplicationDetailEntity {
    return {
      resignationDetails: this.transformDetailsFromApi(dto.resignation_details),
      resignationDocuments: this.transformDocumentListFromApi(dto.resignation_documents),
    };
  }

  // --- Administration ---
  static transformAdministrationFromApi(dto: ResignationAdministrationListItem): ResignationAdministrationEntity {
    return {
      termination_id: dto.termination_id,
      employee_id: dto.employee_id,
      employee_name: dto.employee_name,
      tanggal_pengajuan_terminasi: dto.tanggal_pengajuan_terminasi,
      tanggal_efektif_terminasi: dto.tanggal_efektif_terminasi,
      position_name: dto.position_name,
      description: dto.description,
      end_status: dto.end_status,
      status_terminasi: dto.status_terminasi,
    };
  }

  static transformAdministrationListFromApi(dtoList: ResignationAdministrationListItem[]): ResignationAdministrationEntity[] {
    return dtoList.map(item => this.transformAdministrationFromApi(item));
  }

  static transformAdministrationListWithPagination(
    dtoList: ResignationAdministrationListItem[],
    currentPage: number,
    perPage: number,
    total: number
  ): ResignationAdministrationListEntity {
    return {
      data: this.transformAdministrationListFromApi(dtoList),
      pagination: {
        current_page: currentPage,
        per_page: perPage,
        total,
      },
    };
  }

  static transformAdministrationDetailsFromApi(dto: ResignationAdministrationDetails): ResignationAdministrationDetailsEntity {
    return {
      id: dto.id,
      termination_id: dto.termination_id,
      full_name: dto.full_name,
      NIP: dto.NIP,
      position_name: dto.position_name,
      status_terminasi: dto.status_terminasi,
      tanggal_pengajuan_terminasi: dto.tanggal_pengajuan_terminasi,
      tanggal_efektif_terminasi: dto.tanggal_efektif_terminasi,
      document: dto.document,
      end_status: dto.end_status,
      sisa_kontrak_bulan: dto.sisa_kontrak_bulan,
      file_contract: dto.file_contract,
      letter_of_commitment: dto.letter_of_commitment,
    };
  }

  static transformAdministrationDetailFromApi(dto: ResignationAdministrationDetailResult): ResignationAdministrationDetailEntity {
    return {
      resignationDetails: this.transformAdministrationDetailsFromApi(dto.resignation_details),
      resignationDocuments: this.transformDocumentListFromApi(dto.resignation_documents),
    };
  }

  static transformAdministrationPopupFromApi(dto: AdministrationPopupResult): AdministrationPopupEntity {
    return {
      employee_data: {
        employee_id: dto.employee_data.employee_id,
        employee_name: dto.employee_data.employee_name,
        position_name: dto.employee_data.position_name,
      },
      has_active_loan: dto.has_active_loan,
    };
  }

  // --- Document Types ---
  static transformDocumentTypeFromApi(dto: DocumentTypeItem): DocumentTypeEntity {
    return {
      id: dto.id,
      file_type_name: dto.file_type_name,
      name: dto.name,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
    };
  }

  static transformDocumentTypeListFromApi(dtoList: DocumentTypeItem[]): DocumentTypeEntity[] {
    return dtoList.map(item => this.transformDocumentTypeFromApi(item));
  }

  // --- Contract End Status ---
  static transformContractEndStatusFromApi(dto: ContractEndStatusItem): ContractEndStatusEntity {
    return {
      id: dto.id,
      name: dto.name,
    };
  }

  static transformContractEndStatusListFromApi(dtoList: ContractEndStatusItem[]): ContractEndStatusEntity[] {
    return dtoList.map(item => this.transformContractEndStatusFromApi(item));
  }

  // --- Helper transformations for dropdowns ---
  static transformEmployeeOptionFromApi(dto: any): EmployeeOptionEntity {
    return {
      label: `${dto.id} - ${dto.full_name}`,
      value: dto.id,
      name: dto.full_name,
    };
  }

  static transformEmployeeOptionListFromApi(dtoList: any[]): EmployeeOptionEntity[] {
    return dtoList.map(item => this.transformEmployeeOptionFromApi(item));
  }

  static transformContractEndStatusOptionFromApi(dto: ContractEndStatusItem): ContractEndStatusOptionEntity {
    return {
      label: dto.name,
      value: dto.id,
    };
  }

  static transformContractEndStatusOptionListFromApi(dtoList: ContractEndStatusItem[]): ContractEndStatusOptionEntity[] {
    return dtoList.map(item => this.transformContractEndStatusOptionFromApi(item));
  }
}
