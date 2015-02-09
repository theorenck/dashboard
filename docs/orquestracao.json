{
  "orchestration": {
    "id": "faturamento_por_cliente",
    "statements": [
      {
        "statement": {
          "id": "faturamento_por_cliente",
          "sql": "SELECT V.NOMECLIENTE AS \"CLIENTE\", {FN CONVERT({FN ROUND(SUM(V.VALORTOTALGERAL),2)},SQL_FLOAT)} AS \"TOTAL\" FROM ZW14VPED V WHERE V.SITUACAO = :situacao AND {FN TIMESTAMPADD (SQL_TSI_DAY, V.DATAEMISS-72687, {D '2000-01-01'})} BETWEEN {TS :inicio} AND {TS :fim} GROUP BY V.NOMECLIENTE ORDER BY 1",
          "params": {
            "fim": "'2014-12-26 00:00:00'",
            "inicio": "'2014-11-27 00:00:00'",
            "situacao": "'LOC Locado'"
          }
        }
      }
    ],
    "operations": [
      {
        "execute": {
          "statements": "faturamento_por_cliente",
          "type": "serial"
        }
      },
      {
        "sort": {
          "statement": "faturamento_por_cliente",
          "columns": [
            {
              "reference": 1,
              "order": "desc"
            }
          ]
        }
      },
      {
        "slice": {
          "statement": "faturamento_por_cliente",
          "limit": 10,
          "offset": 0
        }
      }
    ],
    "result": "faturamento_por_cliente"
  }
}