# Duetto Dashboard
Queries utilizadas pelo dashboard da Duetto.

### Sumário
- [Datas Default](#datas-default)
- [Faturamento](#faturamento)
- [RH](#rh)
- [Despesa Total](#despesa-total)
- [ADM](#adm)
- [Impostos](#impostos)


### Datas Default
**inicio** '2014-03-01 00:00:00'

**fim** '2014-03-31 00:00:00'


###Faturamento

```SQL
SELECT SUM(f.valorfluxo) AS "VALOR_TOTAL_RECEITA"
FROM zw20fflu f
WHERE f.modalidade IN ('P','R')
  AND f.estimativa = 'C'
  AND f.pagarreceber = 'R'
  AND (f.tipoorigem = 'S' OR f.tipodestino = 'S' )
  AND {FN TIMESTAMPADD (SQL_TSI_DAY, f.datafluxo-72687, {D '2000-01-01'})} BETWEEN :inicio AND :fim
```


### RH

```SQL
SELECT codigo
FROM zw20fcop cop WHERE cop.classe = '004'
```

```SQL
SELECT SUM(f.valorfluxo) AS "VALOR_TOTAL_RECEITA"
FROM zw20fflu f
WHERE f.modalidade IN ('P','R')
  AND f.estimativa = 'C'
  AND f.tipodestino = 'P'
  AND {FN CONVERT(f.codigodestino, SQL_INTEGER)} IN (36,37,38,39,41,42,43,44,45,47,48,49,51,89,120,154,156,158,159,161,167,168,171,172,228,231,240,255,264,267,269,273)
  AND {FN TIMESTAMPADD (SQL_TSI_DAY, f.competenciaorigem-72687, {D '2000-01-01'})}
       BETWEEN :inicio AND :fim
```

### Despesa Total

```SQL
SELECT SUM(f.valorfluxo) AS "VALOR_TOTAL_DESPESA"
FROM zw20fflu f
WHERE f.modalidade IN ('P','R')
  AND f.estimativa = 'C'
  AND f.pagarreceber = 'P'
  AND (f.tipoorigem = 'P' OR f.tipodestino = 'P' )
  AND {FN TIMESTAMPADD (SQL_TSI_DAY, f.competenciaorigem-72687, {D '2000-01-01'})} BETWEEN :inicio AND :fim
```

### ADM

```SQL
SELECT SUM(f.valorfluxo) AS "VALOR_TOTAL_RECEITA"
FROM zw20fflu f
WHERE f.modalidade IN ('P','R')
  AND f.estimativa = 'C'
  AND f.tipoorigem = 'P'
  AND {FN CONVERT(f.codigoorigem, SQL_INTEGER)} = 137
  AND {FN TIMESTAMPADD (SQL_TSI_DAY, f.competenciaorigem-72687, {D '2000-01-01'})}
      BETWEEN :inicio AND :fim
```

### IMPOSTOS

```SQL
SELECT SUM(f.valorfluxo) AS "VALOR_TOTAL_RECEITA"
FROM zw20fflu f
WHERE f.modalidade IN ('P','R')
  AND f.estimativa = 'C'
  AND f.tipodestino = 'S'
  AND {FN CONVERT(f.codigodestino, SQL_INTEGER)} IN (53,56,57,58,59)
  AND {FN TIMESTAMPADD (SQL_TSI_DAY, f.datafluxo-72687, {D '2000-01-01'})}
      BETWEEN :inicio AND :fim
```
