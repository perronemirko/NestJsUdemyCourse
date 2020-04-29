// describe('my test', ()=>{
//     it('should returns true', () => {
//         expect(true).toEqual(true);
//     });
// });

// feature 

class FriendList{
    friend = [];
    addFriend(name){
        this.friend.push(name);
        this.announceFriendship(name);
    }
    announceFriendship(name){
        global.console.log(`${name} is now a friend!`);
        
    };
    removeFriend(name){
        const idx = this.friend.indexOf(name);
        if (idx === -1 ) {
            throw new Error('Friend not found!');
        }
        this.friend.splice(idx, 1);
    };
}

// tests

describe('FriendList', () => {

    let fl;
    beforeEach(() => {
        fl = new FriendList();
    });




    it('initialize friendlist', () => {
        //const fl = new FriendList();
        expect(fl.friend.length).toEqual(0);
    });

    it('adds a friend to the list', () => {
        //const fl = new FriendList();
        fl.addFriend("ciccio");
        expect(fl.friend.length).toEqual(1);
    });

    it('announces friendship', () => {
        //const fl = new FriendList();
        // mock function
        fl.announceFriendship = jest.fn();
        //
        expect(fl.announceFriendship).not.toHaveBeenCalled();
        fl.addFriend("ciccio");
        expect(fl.announceFriendship).toHaveBeenCalled();
        expect(fl.announceFriendship).toHaveBeenCalledTimes(1);
        expect(fl.announceFriendship).toHaveBeenCalledWith('ciccio');

    });

    describe('removeFriend', () => {
        it('removes a friend from the list', () => {
            fl.addFriend('ciccio');
            expect(fl.friend[0]).toEqual('ciccio');
            fl.removeFriend('ciccio');
            expect(fl.friend[0]).toBeUndefined();
        });

        it('throws an error as friend does not exist', () => {;
            expect (() => fl.removeFriend('ciccio')).toThrow(new Error('Friend not found!'));
        });
    });
});