import RaiBlocks from 'raiblocks'

const options = {
  host: '127.0.0.1',
  port: 3001
}

const client = new RaiBlocks(options);

export { client as RaiBlocks }
