export const multipleDataList = [
  {
    id: '1',
    name: 'Services',
    desc: 'service for it',
    key: 'service',
    enable: false,
    children: [
      {
        id: '2',
        name: 'Europe',
        desc: 'service for Europe',
        key: 'Europe',
        enable: true,
        children: [
          {
            id: '3',
            name: 'French',
            desc: 'service for French',
            key: 'French',
            enable: true,
          },
          {
            id: '4',
            name: 'Paris',
            desc: 'service for Paris',
            key: 'Paris',
            enable: true,
          }
        ]
      },
      {
        id: '5',
        name: 'Asia',
        desc: 'service for Asia',
        key: 'Asia',
        enable: true,
        children: [
          {
            id: '6',
            name: 'China',
            desc: 'service for FrChinaench',
            key: 'China',
            // enable: false,
            children: [
              {
                id: '7',
                name: 'Guangdong',
                desc: 'service for Guangdong',
                key: 'Guangdong',
                // enable: true,
              },
              {
                id: '8',
                name: 'Shanghai',
                desc: 'service for Shanghai',
                key: 'Shanghai',
                enable: true,
              }
            ]
          },
          {
            id: '9',
            name: 'Korea',
            desc: 'service for Korea',
            key: 'Korea',
            enable: true,
          }
        ]
      }
    ]
  }
];