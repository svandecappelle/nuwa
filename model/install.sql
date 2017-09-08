
CREATE TABLE IF NOT EXISTS usr (
	id SERIAL UNIQUE NOT NULL,
	username VARCHAR(255) UNIQUE NOT NULL,
	name VARCHAR(255) NOT NULL,
	firstname VARCHAR(255) NOT NULL,
	mail VARCHAR(500) UNIQUE NOT NULL
);


CREATE TABLE IF NOT EXISTS file(
	id SERIAL UNIQUE NOT NULL,
	usr_id INTEGER REFERENCES usr(id),
	path VARCHAR(4000),
	name VARCHAR(500) NOT NULL,
	value TEXT
);

CREATE TABLE IF NOT EXISTS projects(
	id SERIAL UNIQUE NOT NULL,
	usr_id INTEGER REFERENCES usr(id),
	name VARCHAR(500) NOT NULL
);

CREATE TABLE IF NOT EXISTS project_files(
	project_id INTEGER REFERENCES projects(id),
	file_id INTEGER REFERENCES file(id),
	CONSTRAINT code_id_project_file_constraint UNIQUE(project_id, file_id)
);




CREATE TABLE IF NOT EXISTS snippet(
	id SERIAL UNIQUE NOT NULL,
	usr_id INTEGER REFERENCES usr(id),
	name VARCHAR(500) NOT NULL,
	code_css TEXT,
	code_html TEXT,
	code_js TEXT
);

CREATE TABLE IF NOT EXISTS options_snippet(
	snippet_id INTEGER REFERENCES snippet(id),
	type VARCHAR(10) NOT NULL,
	value VARCHAR(500) NOT NULL,
	CONSTRAINT snippet_id_type_constraint UNIQUE(snippet_id, type)
);

CREATE TABLE IF NOT EXISTS options_file(
	file_id INTEGER REFERENCES file(id),
	type VARCHAR(10) NOT NULL,
	value VARCHAR(500) NOT NULL,
	CONSTRAINT file_id_type_constraint UNIQUE(file_id, type)
);

GRANT SELECT,UPDATE,DELETE,INSERT ON usr TO nuwa;
GRANT SELECT,UPDATE,DELETE,INSERT ON file TO nuwa;
GRANT SELECT,UPDATE,DELETE,INSERT ON projects TO nuwa;
GRANT SELECT,UPDATE,DELETE,INSERT ON options_file TO nuwa;
GRANT SELECT,UPDATE,DELETE,INSERT ON options_snippet TO nuwa;
GRANT SELECT,UPDATE,DELETE,INSERT ON snippet TO nuwa;
GRANT SELECT,UPDATE,DELETE,INSERT ON project_files TO nuwa;

GRANT USAGE, SELECT ON SEQUENCE usr_id_seq TO nuwa;
GRANT USAGE, SELECT ON SEQUENCE file_id_seq TO nuwa;
GRANT USAGE, SELECT ON SEQUENCE projects_id_seq TO nuwa;
GRANT USAGE, SELECT ON SEQUENCE snippet_id_seq TO nuwa;