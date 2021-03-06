-- FATURAMENTO POR CLIENTE
-- Gráfico   = PIE
-- :inicio   = nada, dinâmico do dash || 2014-11-01 00:00:00
-- :situacao = LOC Locado
SELECT
  V.NOMECLIENTE AS "CLIENTE",
  {FN CONVERT({FN ROUND(SUM(V.VALORTOTALGERAL),2)},SQL_FLOAT)} AS "TOTAL"
FROM ZW14VPED V
WHERE V.SITUACAO = :situacao
  AND {FN TIMESTAMPADD (SQL_TSI_DAY, V.DATAEMISS-72687, {D '2000-01-01'})}
  BETWEEN {FN TIMESTAMPADD (SQL_TSI_DAY, -365, :inicio)} AND :inicio
GROUP BY V.NOMECLIENTE
ORDER BY 1

