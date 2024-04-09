import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import { ProductWithBids } from '../intrefaces/product';
import moment from 'moment-timezone';
import 'moment-timezone';

moment.tz.setDefault("Asia/Seoul");

const prisma = new PrismaClient();

const checkDatabase = async () => { //제일큰 입찰가격
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
        }
      }
    }
  });

  const bid = await prisma.bid.findMany({
    where:{

    }
  })

  if (product.length > 0) {
    return product;
  } else {
    return null;
  }
}

export const scheduleCronJobs = () => {
  const data = checkDatabase();
  cron.schedule('* * * * *', async () => {
    if(null !== data){
      
    }
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
  });
}