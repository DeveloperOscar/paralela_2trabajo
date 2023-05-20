export interface ResponseObject<DataType>{
  data: DataType;
  message: string;
  error: string; 
}