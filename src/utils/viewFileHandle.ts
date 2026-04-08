import personalInformationService from "@/features/employee/services/detail/PersonalInformationService";
import { GetTemporaryUrlResponse } from "@/features/employee/types/dto/PersonalInformationType";

export const getTemporaryUrl = async (path: string): Promise<GetTemporaryUrlResponse | null> => {
  if (!path) {
    console.error('Document path is required');
    return null;
  }

  console.log('Getting temporary URL for path:', path);
  // setLoading(true);
  // setError(null);

  try {
    const response = await personalInformationService.getTemporaryUrl(path);

    if (response.meta.status == 200 && response.data) {
      return response.data;
    } else {
      console.error(response.meta?.message || 'Failed to get temporary URL');
      return null;
    }
  } catch (err: any) {
    const errorMessage = err?.message || 'An error occurred while getting temporary URL';
    console.error(errorMessage);
    console.error('getTemporaryUrl error:', err);
    return null;
  } finally {
    // setLoading(false);
  }
};

export const handleViewFile = async (row: any) => {
  console.log('row', row);
    if (!row.fileUrl) {
      console.error('No file URL available');
      return;
    }

    try {
      const temporaryUrlData = await getTemporaryUrl(row.fileUrl);
      if (temporaryUrlData && temporaryUrlData.temporary_url) {
        // Open the document in a new tab
        window.open(temporaryUrlData.temporary_url, '_blank');
      } else {
        console.error('Failed to get temporary URL');
      }
    } catch (error) {
      console.error('Error viewing file:', error);
    }
  };

export const handleViewFileByUrl = async (fileUrl: string) => {
  console.log('fileUrl', fileUrl);
    if (!fileUrl) {
      console.error('No file URL available');
      return;
    }

    try {
      const temporaryUrlData = await getTemporaryUrl(fileUrl);
      if (temporaryUrlData && temporaryUrlData.temporary_url) {
        // Open the document in a new tab
        window.open(temporaryUrlData.temporary_url, '_blank');
      } else {
        console.error('Failed to get temporary URL');
      }
    } catch (error) {
      console.error('Error viewing file:', error);
    }
  };
  
  export default handleViewFile;