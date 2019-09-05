import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import {
  JsonType,
  JsonResp,
  RxRequestInit,
  get as rxget,
  post as rxpost,
  put as rxput,
  remove as rxremove,
  ObbRetType,
} from 'rxxfetch'
import { assertNeverRx } from '@waiting/shared-core'

import { FetchConfig } from './model'
import { parseRespState, parseRespErr } from './handle-cus-response'


export class Fetch {

  private readonly config: FetchConfig['client']

  constructor(config: FetchConfig['client']) {
    this.config = { ...config }
  }

  /**
   * Fetch GET 返回数据类型固定为 json
   * @returns Observable<JsonResp<T>> 泛型T为 Resp.dat 的类型，默认 JsonType
   */
  public get<T extends ObbRetType = JsonType>(
    url: string,
    init?: RxRequestInit,
  ): Observable<T> {

    const args = init ? { ...this.config, ...init } : { ...this.config }
    return rxget<T>(url, args)
  }


  /**
   * Fetch POST 返回数据类型固定为 json
   * @returns Observable<JsonResp<T>> 泛型T为 Resp.dat 的类型，默认 JsonType
   */
  public post<T extends ObbRetType = JsonType>(
    url: string,
    init?: RxRequestInit,
  ): Observable<T> {

    const args = init ? { ...this.config, ...init } : { ...this.config }
    return rxpost<T>(url, args)
  }


  /**
   * Fetch PUT 返回数据类型固定为 json
   * @returns Observable<JsonResp<T>> 泛型T为 Resp.dat 的类型，默认 JsonType
   */
  public put<T extends ObbRetType = JsonType>(
    url: string,
    init?: RxRequestInit,
  ): Observable<T> {

    const args = init ? { ...this.config, ...init } : { ...this.config }
    return rxput<T>(url, args)
  }


  /**
   * Fetch REMOVE 返回数据类型固定为 json
   * @returns Observable<JsonResp<T>> 泛型T为 Resp.dat 的类型，默认 JsonType
   */
  public remove<T extends ObbRetType = JsonType>(
    url: string,
    init?: RxRequestInit,
  ): Observable<T> {

    const args = init ? { ...this.config, ...init } : { ...this.config }
    return rxremove<T>(url, args)
  }


  /* --------------- Response with Custom data structure JsonResp<TDat> ----------- */

  /**
   * Fetch GET 返回数据类型固定为 json
   * @returns Observable<JsonResp<T>> 泛型T为 Resp.dat 的类型，默认 JsonType
   */
  public xget<TDat extends JsonType = JsonType>(
    url: string,
    init?: RxRequestInit,
  ): Observable<JsonResp<TDat>> {

    const args = init ? { ...this.config, ...init } : { ...this.config }
    return fetchJsonResp<TDat>(url, args, 'get')
  }


  /**
   * Fetch POST 返回数据类型固定为 json
   * @returns Observable<JsonResp<T>> 泛型T为 Resp.dat 的类型，默认 JsonType
   */
  public xpost<TDat extends JsonType = JsonType>(
    url: string,
    init?: RxRequestInit,
  ): Observable<JsonResp<TDat>> {

    const args = init ? { ...this.config, ...init } : { ...this.config }
    return fetchJsonResp<TDat>(url, args, 'post')
  }


  /**
   * Fetch PUT 返回数据类型固定为 json
   * @returns Observable<JsonResp<T>> 泛型T为 Resp.dat 的类型，默认 JsonType
   */
  public xput<TDat extends JsonType = JsonType>(
    url: string,
    init?: RxRequestInit,
  ): Observable<JsonResp<TDat>> {

    const args = init ? { ...this.config, ...init } : { ...this.config }
    return fetchJsonResp<TDat>(url, args, 'put')
  }


  /**
   * Fetch REMOVE 返回数据类型固定为 json
   * @returns Observable<JsonResp<T>> 泛型T为 Resp.dat 的类型，默认 JsonType
   */
  public xremove<TDat extends JsonType = JsonType>(
    url: string,
    init?: RxRequestInit,
  ): Observable<JsonResp<TDat>> {

    const args = init ? { ...this.config, ...init } : { ...this.config }
    return fetchJsonResp<TDat>(url, args, 'remove')
  }

}


function fetchJsonResp<TDat extends JsonType>(
  url: string,
  init: RxRequestInit,
  type: 'get' | 'post' | 'put' | 'remove',
): Observable<JsonResp<TDat>> {

  let req$: Observable<JsonResp<TDat>>

  switch (type) {
    case 'get':
      req$ = rxget(url, init)
      break
    case 'post':
      req$ = rxpost(url, init)
      break
    case 'put':
      req$ = rxput(url, init)
      break
    case 'remove':
      req$ = rxremove(url, init)
      break
    default:
      return assertNeverRx(type)
  }

  const ret$ = req$.pipe(
    map(parseRespState),
    tap(res => parseRespErr(res)),
  )

  return ret$
}

