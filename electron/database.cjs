const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

class DatabaseManager {
  constructor(userDataPath) {
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }
    const dbPath = path.join(userDataPath, 'sai_consult.db');
    this.db = new DatabaseSync(dbPath);
    this.initSchema();
  }

  initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        cuit TEXT NOT NULL,
        contactPerson TEXT,
        email TEXT,
        phone TEXT,
        projectType TEXT NOT NULL,
        locationName TEXT,
        province TEXT,
        coordinates TEXT,
        elevationMsl REAL,
        referenceTemperatureC REAL,
        terrainLengthAvailableM REAL,
        terrainWidthAvailableM REAL,
        notes TEXT,
        documents TEXT,
        createdAt TEXT,
        updatedAt TEXT
      );

      CREATE TABLE IF NOT EXISTS wind_studies (
        id TEXT PRIMARY KEY,
        clientId TEXT NOT NULL,
        studyName TEXT NOT NULL,
        data TEXT NOT NULL,
        createdAt TEXT
      );

      CREATE TABLE IF NOT EXISTS lad_studies (
        id TEXT PRIMARY KEY,
        clientId TEXT NOT NULL,
        studyName TEXT NOT NULL,
        data TEXT NOT NULL,
        createdAt TEXT
      );

      CREATE TABLE IF NOT EXISTS ladh_studies (
        id TEXT PRIMARY KEY,
        clientId TEXT NOT NULL,
        studyName TEXT NOT NULL,
        data TEXT NOT NULL,
        createdAt TEXT
      );
    `);
  }

  getClients() {
    const stmt = this.db.prepare('SELECT * FROM clients ORDER BY updatedAt DESC');
    const rows = stmt.all();
    return rows.map(r => ({
      ...r,
      coordinates: r.coordinates ? JSON.parse(r.coordinates) : { lat: 0, lng: 0 },
      documents: r.documents ? JSON.parse(r.documents) : []
    }));
  }

  saveClient(client) {
    const existingStmt = this.db.prepare('SELECT id FROM clients WHERE id = ?');
    const existing = existingStmt.get(client.id);

    const now = new Date().toISOString().split('T')[0];
    const coordsStr = JSON.stringify(client.coordinates || {});
    const docsStr = JSON.stringify(client.documents || []);

    if (existing) {
      const updateStmt = this.db.prepare(`
        UPDATE clients SET
          name = ?, cuit = ?, contactPerson = ?, email = ?, phone = ?,
          projectType = ?, locationName = ?, province = ?, coordinates = ?,
          elevationMsl = ?, referenceTemperatureC = ?, terrainLengthAvailableM = ?,
          terrainWidthAvailableM = ?, notes = ?, documents = ?, updatedAt = ?
        WHERE id = ?
      `);
      updateStmt.run(
        client.name,
        client.cuit,
        client.contactPerson || '',
        client.email || '',
        client.phone || '',
        client.projectType,
        client.locationName || '',
        client.province || '',
        coordsStr,
        client.elevationMsl || 0,
        client.referenceTemperatureC || 15,
        client.terrainLengthAvailableM || 0,
        client.terrainWidthAvailableM || 0,
        client.notes || '',
        docsStr,
        now,
        client.id
      );
    } else {
      const insertStmt = this.db.prepare(`
        INSERT INTO clients (
          id, name, cuit, contactPerson, email, phone,
          projectType, locationName, province, coordinates,
          elevationMsl, referenceTemperatureC, terrainLengthAvailableM,
          terrainWidthAvailableM, notes, documents, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertStmt.run(
        client.id,
        client.name,
        client.cuit,
        client.contactPerson || '',
        client.email || '',
        client.phone || '',
        client.projectType,
        client.locationName || '',
        client.province || '',
        coordsStr,
        client.elevationMsl || 0,
        client.referenceTemperatureC || 15,
        client.terrainLengthAvailableM || 0,
        client.terrainWidthAvailableM || 0,
        client.notes || '',
        docsStr,
        client.createdAt || now,
        now
      );
    }
    return client;
  }

  deleteClient(id) {
    this.db.prepare('DELETE FROM clients WHERE id = ?').run(id);
    this.db.prepare('DELETE FROM wind_studies WHERE clientId = ?').run(id);
    this.db.prepare('DELETE FROM lad_studies WHERE clientId = ?').run(id);
    this.db.prepare('DELETE FROM ladh_studies WHERE clientId = ?').run(id);
    return true;
  }

  updateDocumentStatus(clientId, docId, newStatus, notes) {
    const clientStmt = this.db.prepare('SELECT * FROM clients WHERE id = ?');
    const row = clientStmt.get(clientId);
    if (!row) return null;

    const docs = row.documents ? JSON.parse(row.documents) : [];
    const docIdx = docs.findIndex(d => d.id === docId);
    if (docIdx >= 0) {
      docs[docIdx].status = newStatus;
      if (notes !== undefined) docs[docIdx].notes = notes;
      if (newStatus === 'APPROVED') {
        docs[docIdx].approvalDate = new Date().toISOString().split('T')[0];
      }
      if (newStatus === 'IN_PROGRESS' && !docs[docIdx].submittedDate) {
        docs[docIdx].submittedDate = new Date().toISOString().split('T')[0];
      }
      const updatedDocsStr = JSON.stringify(docs);
      this.db
        .prepare('UPDATE clients SET documents = ?, updatedAt = ? WHERE id = ?')
        .run(updatedDocsStr, new Date().toISOString().split('T')[0], clientId);
      return {
        ...row,
        coordinates: JSON.parse(row.coordinates || '{}'),
        documents: docs
      };
    }
    return null;
  }

  getWindStudies(clientId) {
    const query = clientId
      ? 'SELECT data FROM wind_studies WHERE clientId = ?'
      : 'SELECT data FROM wind_studies';
    const stmt = this.db.prepare(query);
    const rows = clientId ? stmt.all(clientId) : stmt.all();
    return rows.map(r => JSON.parse(r.data));
  }

  saveWindStudy(study) {
    const existing = this.db.prepare('SELECT id FROM wind_studies WHERE id = ?').get(study.id);
    const now = new Date().toISOString().split('T')[0];
    const dataStr = JSON.stringify(study);
    if (existing) {
      this.db.prepare('UPDATE wind_studies SET data = ? WHERE id = ?').run(dataStr, study.id);
    } else {
      this.db
        .prepare(
          'INSERT INTO wind_studies (id, clientId, studyName, data, createdAt) VALUES (?, ?, ?, ?, ?)'
        )
        .run(study.id, study.clientId, study.studyName || '', dataStr, study.createdAt || now);
    }
    return study;
  }

  getLadStudies(clientId) {
    const query = clientId
      ? 'SELECT data FROM lad_studies WHERE clientId = ?'
      : 'SELECT data FROM lad_studies';
    const stmt = this.db.prepare(query);
    const rows = clientId ? stmt.all(clientId) : stmt.all();
    return rows.map(r => JSON.parse(r.data));
  }

  saveLadStudy(study) {
    const existing = this.db.prepare('SELECT id FROM lad_studies WHERE id = ?').get(study.id);
    const now = new Date().toISOString().split('T')[0];
    const dataStr = JSON.stringify(study);
    if (existing) {
      this.db.prepare('UPDATE lad_studies SET data = ? WHERE id = ?').run(dataStr, study.id);
    } else {
      this.db
        .prepare(
          'INSERT INTO lad_studies (id, clientId, studyName, data, createdAt) VALUES (?, ?, ?, ?, ?)'
        )
        .run(study.id, study.clientId, study.studyName || '', dataStr, study.createdAt || now);
    }
    return study;
  }

  getLadhStudies(clientId) {
    const query = clientId
      ? 'SELECT data FROM ladh_studies WHERE clientId = ?'
      : 'SELECT data FROM ladh_studies';
    const stmt = this.db.prepare(query);
    const rows = clientId ? stmt.all(clientId) : stmt.all();
    return rows.map(r => JSON.parse(r.data));
  }

  saveLadhStudy(study) {
    const existing = this.db.prepare('SELECT id FROM ladh_studies WHERE id = ?').get(study.id);
    const now = new Date().toISOString().split('T')[0];
    const dataStr = JSON.stringify(study);
    if (existing) {
      this.db.prepare('UPDATE ladh_studies SET data = ? WHERE id = ?').run(dataStr, study.id);
    } else {
      this.db
        .prepare(
          'INSERT INTO ladh_studies (id, clientId, studyName, data, createdAt) VALUES (?, ?, ?, ?, ?)'
        )
        .run(study.id, study.clientId, study.studyName || '', dataStr, study.createdAt || now);
    }
    return study;
  }
}

module.exports = { DatabaseManager };
