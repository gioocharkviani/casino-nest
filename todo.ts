//რეპორტი 
//===== NEST JS NOTIFICATION SERVICE z===//

//===== გამოყენებული რესურსები===//

// Prisma - მონაცემთა ბაზებთან კომუნიკაციისთვის
// Soket io - მონაცემთა ბაზებთან ლაივ კომუნიკაცია


// ==== მონაცემთა ბაზა ====//

// შეტყობინების შესანახად ვიყენებ Mysql მონაცემთა ბაზას.

// model Notification {
//     id          String    @id
//     recipientId String    
//     content     Notificontent[]
//     category    String
//     readAt      DateTime?
//     createdAt   DateTime  @default(now())
//     @@index([recipientId])
//   }
  
// model Notificontent {
//     id                String    @id
//     notificationId    String
//     notification      Notification @relation(fields: [notificationId], references: [id])
//     content           String
//   }
  
// შეტყობინების შესანახად  ვაგენერირებ ორ თეიბლს notification და notifiContent  რომელბიც დაკავშირებულია ერთმანეთთან რელაციით . notificontent შესაძლებელია შეიცვალოს და განახლდეს მოთხოვნის მიხედვით  . 

// ==== ძირითადი რეპორტი ====//

// ძირითადი notification სერვისი დასრულებულია . ადმინს შეუძლია შექმნას შეცვალოს და წაშალოს notification . ამ ეტაპზე ვმუშაობ notification წვდომებზე და middlwere ზე რადგან მხოლოდ ადმინს უნდა შეეძლოს რომ ნახოს ყველა შეტყობინება და ასევე შეცვალოს. ამ ეტაპზე ასევე ვმუშაობ auto triggered ფუნქციაზე რომეიც ადმინ პანელიდან უნდა კოტროლდებოდეს რადგან არის შეტყობინებები რომელიც ავტომატურად უნდა იგზავნებოდეს სხვადასხვა მითითებულ დროს .