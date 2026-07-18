import { deleteAll, deleteSingle, getAll, markAllRead } from '@/services/admin/notification/webpush';
import { verifyAdminSession, unauthorizedJson } from '@/lib/adminAuth';

export async function GET(req) {
  if (!(await verifyAdminSession())) {
    return unauthorizedJson();
  }

  const notifications = await getAll();
  return Response.json(notifications);
}

export async function POST(req) {
  if (!(await verifyAdminSession())) {
    return unauthorizedJson();
  }

  await markAllRead();
  return Response.json({ success: true });
}
export async function DELETE(req) {
  if (!(await verifyAdminSession())) {
    return unauthorizedJson();
  }

  const body = await req.json();
  const {option,id} = body;
  console.log(option,id)
  if(option === "all"){
    await deleteAll();
    console.log("deleteoption " + option)
  }else if(option === "single"){
    console.log("deleteid " + id)
    // await deleteSingle(id);
      return Response.json({ success: true, message: "This service not availeble this time" });
  }
  
  return Response.json({ success: true });
}