<?php

class UnfinishedСlass {
    private $handler;
    public function runMe()
    {
        if (!$this->handler->current()){
            return true;
        }else{
            throw new Exception();
        }
    }

}


class First{
    private $flag;
    public function runMe(){
        return $this->flag;
    }
}

class Second{
    private $flag = false;
    private $my_obj;
    public function changeFlag(){
        $this->flag=true;
    }
    public function runMe(){
        if ($this->flag===true){
            echo $this->my_obj->trash1;
            return true;
        }
        else{
            return false;
        }
    }
}

class PlayGround{
    public function __construct(){
        $this->first = new First();
        $this->second = new Second();
        $this->third = new UnfinishedСlass();
    }
    private $first;
    private $second;
    private $third;
    public function __wakeup(){
        echo "I am from __wakeup() method \n";
        if ($this->first->runMe()){
            if ($this->second->runMe()){
                if ($this->third->runMe()){
                    echo 'VolgaCTF{your flag}';
                }
            }
        }
    }
}
//$obj = new PlayGround();
//$serializedStr = serialize($obj);
//echo $serializedStr;
//

// Unserializing the string object
var_dump(unserialize($serializedStr));
