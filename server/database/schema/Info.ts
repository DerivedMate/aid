import { UUID } from '../../../shared/query/columnTypes'
import { AdditionalInfo, getInfoQRes, SupervisedEditReq, SupervisedInfoRes } from '../../../shared/query/info'
import { query } from '../db'
import { QError } from '../types'

export const getSupervisedInfo = (supervised_id: UUID): Promise<getInfoQRes> =>
  query(
    `
      select 
        i.name, i.lastname,
        i.blood_type,
        i.hc_number
      from info i 
      where i.supervised_id = $1
    `,
    [supervised_id]
  ).then(r => {
    if (r.rows.length === 0) return [false, new Error(QError.EntryNotFound)]
    return [true, r.rows[0] as SupervisedInfoRes]
  })

export const getAdditionalInfo = (supervised_id: UUID): Promise<AdditionalInfo[]> =>
  query(
    `
      select 
        a.add_info_id,
        a.key,
        a.value
      from info i
      inner join add_info a using (info_id)
      where i.supervised_id = $1 
      order by a.key ASC ;
    `,
    [supervised_id]
  ).then(r => r.rows as AdditionalInfo[])

export const createAdditionalInfo = (supervised_id: UUID, kvp: AdditionalInfo[]): Promise<number> =>
  query(
    `
      insert into add_info (
        select 
          uuid_generate_v4(),
          in_id.info_id info_id,
          (tmp.data ->> 'key')::varchar,
          (tmp.data ->> 'value')::varchar
        from (
          SELECT json_array_elements($2::json) AS data
        ) tmp, (
          select i.info_id
          from info i 
          where i.supervised_id = $1
        ) in_id
      );
      `,
    [supervised_id, JSON.stringify(kvp)]
  ).then(r => r.rowCount)

export const updateAdditionalInfo = (kvp: AdditionalInfo[]): Promise<number> =>
  query(
    `
      update add_info 
      set 
        key   = (data ->> 'key')::varchar,
        value = (data ->> 'value')::varchar
      from (
          SELECT json_array_elements($1::json) AS data
        ) tmp
      where add_info_id = (data ->> 'add_info_id')::uuid ;
      `,
    [JSON.stringify(kvp)]
  ).then(r => r.rowCount)

export const deletedAdditionalData = (ids: UUID[]): Promise<number> =>
  query(
    `
      delete from add_info
      where add_info_id = ANY ($1)
    `,
    [ids as any]
  ).then(r => r.rowCount)

export const updateSupervisedInfo = (
  supervised_id: UUID,
  { name, lastname, blood_type, hc_number }: SupervisedEditReq
): Promise<boolean> =>
  query(
    `
      update info
      set 
        name       = $2,
        lastname   = $3,
        blood_type = $4,
        hc_number  = $5
      where 
        supervised_id = $1;
    `,
    [supervised_id, name, lastname, blood_type, hc_number]
  ).then(r => r.rowCount === 1)
