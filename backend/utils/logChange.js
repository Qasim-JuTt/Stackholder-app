// utils/logChange.js
import ChangeLog from '../models/ChangeLog.js';

export const logChange = async ({
  modelName,
  documentId,
  operation,
  updatedBy,
  before = null,
  after = null,
  deletedData = null,
  createdData = null,
}) => {
  try {
    await ChangeLog.create({
      model: modelName,
      documentId,
      operation,
      updatedBy,
      before,
      after,
      deletedData,
      createdData,
    });
  } catch (err) {
    console.error('Logging failed:', err.message);
  }
};
