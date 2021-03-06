/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Item      = require('../../app/models/item'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    Mongo     = require('mongodb'),
    db        = 'dibster-test';

describe('Item', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Item object', function(){
      var o = {name:'Test', description:'This is a test.', photo:'url', cateogy:'category 1', tags:'tag1, tag2'},
          i = new Item('000000000000000000000001', o);
      expect(i).to.be.instanceof(Item);
      expect(i.name).to.equal('Test');
      expect(i.description).to.equal('This is a test.');
      expect(i.tags).to.have.length(2);
      expect(i.tags[1]).to.equal('tag2');
      expect(i.photo).to.equal('url');
      expect(i.datePosted).to.be.instanceof(Date);
      expect(i.ownerId).to.be.instanceof(Mongo.ObjectID);
      expect(i.isAvailable).to.be.true;
    });
  });

  describe('.create', function(){
    it('should create a new Item & save it in the database', function(done){
      var testItem = {name:'Test', description:'This is a test.', photo:'url', category:'category 1', tags:'tag1, tag2'};
      Item.create('000000000000000000000001', testItem, function(err, item){
        console.log('--------TEST ITEM-------');
        console.log(testItem);
        expect(item._id).to.be.instanceof(Mongo.ObjectID);
        expect(item).to.be.ok;
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should return an Item in the database by it\'s ID', function(done){
      var id = Mongo.ObjectID('a00000000000000000000002');
      Item.findById(id, function(err, item){
        expect(item.name).to.equal('Shrubbery');
        expect(item.description).to.include('Knights');
        done();
      });
    });
  });

  describe('.findAllByOwner', function(){
    it('should return all items owned by the user in the database', function(done){
      var id = Mongo.ObjectID('000000000000000000000001');
      Item.findAllByOwner(id, function(err, items){
        expect(items).to.have.length(3);
        expect(items[1].numBids).to.equal(1);
        done();
      });
    });
  });

  // TODO: write .destroy test

// Last bracket
});
