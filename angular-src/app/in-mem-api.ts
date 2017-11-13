import { InMemoryDbService } from 'angular-in-memory-web-api';
import { environment } from '../environments/environment';

export class InMemService implements InMemoryDbService {

  //
  createDb() {
    let events = [
      { 
        id: 1,
        title: 'Azure App Dev Workshop', 
        type: 'workshop', 
        start: '2017-01-01', 
        end: '2017-12-30',
        topics: [
          {id: 1, desc: 'General' }
        ]
      },
      { 
        id: 2,
        title: 'Introduction to PaaS', 
        type: 'event', 
        start: '2018-10-29', 
        end: '2018-10-31',
        topics: [
          {id: 1, desc: 'Morning Session'},
          {id: 2, desc: 'Afternoon Session'}
        ]
      },
      { 
        id: 3,
        title: 'Goat Herding with Bill Oddie', 
        type: 'lab', 
        start: '2017-02-07', 
        end: '2017-02-07',
        topics: [
          {id: 1, desc: 'Intro to Goats'},
          {id: 2, desc: 'More about Goats'}
        ]
      }      
    ];
    let feedback = [
      { 
        id: 1, 
        event: 1,
        topic: 1,
        rating: 5, 
        comment: "Best workshop on Azure, I've been to this week!"
      },
      { 
        id: 2, 
        event: 2,
        topic: 1,
        rating: 5, 
        comment: "I loved the morning session!"
      },
      { 
        id: 3, 
        event: 2,
        topic: 2,
        rating: 2, 
        comment: "I hated the afternoon",
        sentiment: 0.3780291
      },
      { 
        id: 3, 
        event: 2,
        topic: 2,
        rating: 3, 
        comment: "I kinda liked the afternoon"
      },      
      { 
        id: 4, 
        event: 3,
        topic: 2,
        rating: 3, 
        comment: "The PaaS afternoon was ok"
      }                  
    ];    

    // This is important!
    // Elegant way to bypass the in-mem API when in production mode
    if(!environment.production) {
      return {events, feedback};
    } else {
      return {};
    }
  }
}