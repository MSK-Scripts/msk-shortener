-- 004: clicks.ip_hash entfernen
--
-- Die Spalte wurde bei jedem Klick geschrieben und an keiner Stelle gelesen:
-- keine Abfrage, kein Index, keine Auswertung. Weil `IP_HASH_SECRET` ein
-- fester Pepper ist, war der Wert trotzdem pseudonym und nicht anonym, der
-- IPv4-Raum laesst sich mit dem Secret in vertretbarer Zeit durchprobieren.
--
-- Damit stand in `clicks` ein personenbezogenes Merkmal, das niemand braucht,
-- unbefristet gespeichert, waehrend die Datenschutzerklaerung die Klickdaten
-- als anonymisiert und ohne Personenbezug beschreibt. Statt die Erklaerung an
-- die Daten anzupassen und eine Frist zu erfinden, faellt die Spalte weg.
-- Danach stimmt der Text, und es gibt nichts mehr aufzubewahren.
--
-- `links.created_ip_hash` bleibt: dort haengt der Index
-- `idx_links_ip_created` daran, und die Spalte ist die einzige Handhabe gegen
-- Missbrauch beim Anlegen von Links.

ALTER TABLE clicks DROP COLUMN ip_hash;
