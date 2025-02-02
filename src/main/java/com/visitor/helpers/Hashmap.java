/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.visitor.helpers;

import java.util.HashMap;

/**
 *
 * @author pseudo
 * @param <Key>
 * @param <Value>
 */
public class Hashmap<Key, Value> extends HashMap <Key, Value> {
    
    
    /**
     *
     */
    public Hashmap() {
    }
    
    /**
     *
     * @param key
     * @param value
     */
    public Hashmap(Key key, Value value) {
        super.put(key, value);
    }
    
    /**
     *
     * @param key
     * @param value
     * @return
     */
    public Hashmap<Key, Value> putIn(Key key, Value value){
        super.put(key, value);
        return this;
    }
  

    
    /**
     *
     * @param key
     * @return
     */
    public Hashmap<Key, Value> removeFrom(Key key){
        super.remove(key);
        return this;
    }
}
