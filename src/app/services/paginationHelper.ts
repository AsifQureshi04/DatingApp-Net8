import { HttpParams, HttpResponse } from "@angular/common/http";
import { PaginatedResult } from "../Models/pagination";
import { signal } from "@angular/core";

export function setPaginatedResponse<T>(response : HttpResponse<any>,
        paginatedResultSignal: ReturnType<typeof signal<PaginatedResult<T> | null>>){
            paginatedResultSignal.set({
            items: response.body.data as T,
            pagination: JSON.parse(response.headers.get('Pagination')!) 
            })
  }
   
export function setPaginationHeaders(pageNumber : number , pageSize : number){
    let params = new HttpParams();
    if(pageNumber && pageSize){
      params = params.append('pageNumber',pageNumber.toString());
      params = params.append('pageSize',pageSize.toString());
    }
    return params;
  }