import Transaction from '../../persistent/transactions/models/Transaction';

export default interface Meeting {
  congregation_transaction: Transaction;
  worldwide_transaction: Transaction;
  cash: number;
  cheques: number;
}
