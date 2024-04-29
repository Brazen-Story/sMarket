import cron from 'node-cron';
import { ProductWithBids } from '../intrefaces/product';
import moment from 'moment-timezone';
import 'moment-timezone';
import prisma from '../client';
import { app } from '..';

moment.tz.setDefault("Asia/Seoul");

const checkDatabase = async () => {
  const product: ProductWithBids[] = await prisma.product.findMany({
    where: {
      end_date: moment().format('YYYY-MM-DD HH:mm:00'),
    },
    select: {
      product_id: true,
      seller_id: true,
      bid: {
        select: {
          user_id: true,
          bidPrice: true,
        },
        orderBy: {
          bidPrice: 'desc',
        },
      },
    }
  });

  const highestBids = product.map(product => {
    const highestBid = product.bid[0] ? {
      user_id: product.bid[0].user_id,
      bidPrice: product.bid[0].bidPrice
    } : null;
    return {
      product_id: product.product_id,
      seller_id: product.seller_id,
      highestBid: highestBid
    };
  });

  return highestBids;
}

export const scheduleCronJobs = () => {
  cron.schedule('* * * * *', async () => {
    const data = await checkDatabase(); 

    if (data && data.length > 0) {
      await Promise.all(data.map(async ({ product_id, seller_id, highestBid }) => { 
        if (highestBid) {
          const newRoom = await prisma.chat_room.create({ 
            data: {
              product_id: product_id,
              seller_id: seller_id,
              buyer_id: highestBid.user_id,
            }
          });

          const io = app.get('io');
          io.of('/room').emit('newRoom', newRoom);
        }
      }));
    }
  });
};