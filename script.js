document.addEventListener('DOMContentLoaded', function() {
      // Initialize jsPDF
      const { jsPDF } = window.jspdf;
      
      // DOM Elements
      const dropArea = document.getElementById('drop-area');
      const fileInput = document.getElementById('file-input');
      const fileList = document.getElementById('file-list');
      const clearAllBtn = document.getElementById('clear-all');
      const generateBtn = document.getElementById('generate-pdf');
      const progressContainer = document.getElementById('progress');
      const progressFill = document.querySelector('.progress-fill');
      const progressPercent = document.querySelector('.progress-percent');
      const startConvertingBtn = document.getElementById('start-converting');
      const mobileMenuBtn = document.getElementById('mobile-menu-btn');
      const navList = document.querySelector('.nav-list');
      
      // Settings elements
      const pageSizeSelect = document.getElementById('page-size');
      const customSizeGroup = document.getElementById('custom-size-group');
      const customWidth = document.getElementById('custom-width');
      const customHeight = document.getElementById('custom-height');
      const pageLayoutRadios = document.querySelectorAll('input[name="orientation"]');
      const imagePerPageRadios = document.querySelectorAll('input[name="images-per-page"]');
      const customGridGroup = document.getElementById('custom-grid-group');
      const gridRows = document.getElementById('grid-rows');
      const gridCols = document.getElementById('grid-cols');
      const marginSize = document.getElementById('margin-size');
      const marginValue = document.getElementById('margin-value');
      const borderStyleRadios = document.querySelectorAll('input[name="border-style"]');
      const borderOptionsGroup = document.getElementById('border-options-group');
      const borderWidth = document.getElementById('border-width');
      const borderWidthValue = document.getElementById('border-width-value');
      const borderColor = document.getElementById('border-color');
      const pageSpread = document.getElementById('page-spread');
      const backgroundColor = document.getElementById('background-color');
      const compression = document.getElementById('compression');
      const outputFilename = document.getElementById('output-filename');
      const pdfTitle = document.getElementById('pdf-title');
      const pdfAuthor = document.getElementById('pdf-author');
      const pdfSubject = document.getElementById('pdf-subject');
      const pdfProtectionRadios = document.querySelectorAll('input[name="pdf-protection"]');
      const passwordFields = document.getElementById('password-fields');
      
      // Tab elements
      const tabBtns = document.querySelectorAll('.tab-btn');
      const tabContents = document.querySelectorAll('.tab-content');
      
      // FAQ elements
      const faqQuestions = document.querySelectorAll('.faq-question');
      
      // Store uploaded files
      let uploadedFiles = [];
      
      // Initialize Sortable for file list
      new Sortable(fileList, {
          animation: 150,
          onEnd: function() {
              // Update the uploadedFiles array to match the new order
              const items = fileList.querySelectorAll('.file-item');
              uploadedFiles = Array.from(items).map(item => {
                  return uploadedFiles.find(file => file.name === item.dataset.filename);
              });
          }
      });
      
      // Event Listeners for settings
      pageSizeSelect.addEventListener('change', function() {
          customSizeGroup.classList.toggle('hidden', this.value !== 'custom');
      });
      
      imagePerPageRadios.forEach(radio => {
          radio.addEventListener('change', function() {
              customGridGroup.classList.toggle('hidden', this.value !== 'custom');
          });
      });
      
      borderStyleRadios.forEach(radio => {
          radio.addEventListener('change', function() {
              borderOptionsGroup.classList.toggle('hidden', this.value === 'none');
          });
      });
      
      marginSize.addEventListener('input', function() {
          marginValue.textContent = this.value;
      });
      
      borderWidth.addEventListener('input', function() {
          borderWidthValue.textContent = this.value;
      });
      
      pdfProtectionRadios.forEach(radio => {
          radio.addEventListener('change', function() {
              passwordFields.classList.toggle('hidden', this.value !== 'password');
          });
      });
      
      // Tab functionality
      tabBtns.forEach(btn => {
          btn.addEventListener('click', function() {
              const tabId = this.dataset.tab;
              
              // Remove active class from all buttons and contents
              tabBtns.forEach(btn => btn.classList.remove('active'));
              tabContents.forEach(content => content.classList.remove('active'));
              
              // Add active class to clicked button and corresponding content
              this.classList.add('active');
              document.querySelector(`.tab-content[data-tab="${tabId}"]`).classList.add('active');
          });
      });
      
      // FAQ accordion
      faqQuestions.forEach(question => {
          question.addEventListener('click', function() {
              this.classList.toggle('active');
              const answer = this.nextElementSibling;
              
              if (this.classList.contains('active')) {
                  answer.classList.add('active');
                  answer.style.maxHeight = answer.scrollHeight + 'px';
              } else {
                  answer.classList.remove('active');
                  answer.style.maxHeight = '0';
              }
          });
      });
      
      // Mobile menu toggle
      mobileMenuBtn.addEventListener('click', function() {
          navList.classList.toggle('active');
      });
      
      // Clear all files
      clearAllBtn.addEventListener('click', function() {
          uploadedFiles = [];
          updateFileList();
      });
      
      // Scroll to converter when clicking "Start Converting"
      startConvertingBtn.addEventListener('click', function() {
          document.getElementById('converter').scrollIntoView({ behavior: 'smooth' });
      });
      
      // Prevent default drag behaviors
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
          dropArea.addEventListener(eventName, preventDefaults, false);
          document.body.addEventListener(eventName, preventDefaults, false);
      });
      
      // Highlight drop area when item is dragged over it
      ['dragenter', 'dragover'].forEach(eventName => {
          dropArea.addEventListener(eventName, highlight, false);
      });
      
      ['dragleave', 'drop'].forEach(eventName => {
          dropArea.addEventListener(eventName, unhighlight, false);
      });
      
      // Handle dropped files
      dropArea.addEventListener('drop', handleDrop, false);
      
      // Handle selected files
      fileInput.addEventListener('change', handleFiles, false);
      
      // Generate PDF button
      generateBtn.addEventListener('click', generatePDF);
      
      // Functions
      function preventDefaults(e) {
          e.preventDefault();
          e.stopPropagation();
      }
      
      function highlight() {
          dropArea.classList.add('highlight');
      }
      
      function unhighlight() {
          dropArea.classList.remove('highlight');
      }
      
      function handleDrop(e) {
          const dt = e.dataTransfer;
          const files = dt.files;
          handleFiles({ target: { files } });
      }
      
      function handleFiles(e) {
          const files = e.target.files;
          
          if (files.length === 0) return;
          
          for (let i = 0; i < files.length; i++) {
              const file = files[i];
              
              // Check if file is an image
              if (!file.type.match('image.*')) {
                  alert(`File "${file.name}" is not an image and will be skipped.`);
                  continue;
              }
              
              // Add to uploadedFiles if not already there
              if (!uploadedFiles.some(f => f.name === file.name)) {
                  uploadedFiles.push(file);
              }
          }
          
          updateFileList();
      }
      
      function updateFileList() {
          fileList.innerHTML = '';
          
          if (uploadedFiles.length === 0) {
              fileList.innerHTML = '<p class="empty-message">No files selected</p>';
              return;
          }
          
          uploadedFiles.forEach(file => {
              const fileItem = document.createElement('div');
              fileItem.className = 'file-item';
              fileItem.dataset.filename = file.name;
              
              fileItem.innerHTML = `
                  <i class="fas fa-image"></i>
                  <span class="file-name">${file.name}</span>
                  <span class="file-size">${formatFileSize(file.size)}</span>
                  <i class="fas fa-times remove-file"></i>
              `;
              
              fileList.appendChild(fileItem);
              
              // Add remove event
              fileItem.querySelector('.remove-file').addEventListener('click', () => {
                  uploadedFiles = uploadedFiles.filter(f => f.name !== file.name);
                  updateFileList();
              });
          });
      }
      
      function formatFileSize(bytes) {
          if (bytes === 0) return '0 Bytes';
          
          const k = 1024;
          const sizes = ['Bytes', 'KB', 'MB', 'GB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          
          return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
      }
      
      async function generatePDF() {
          if (uploadedFiles.length === 0) {
              alert('Please upload at least one image.');
              return;
          }
          
          // Show progress bar
          progressContainer.classList.remove('hidden');
          progressFill.style.width = '0%';
          progressPercent.textContent = '0%';
          
          // Get settings
          const settings = {
              pageSize: pageSizeSelect.value,
              customWidth: parseFloat(customWidth.value),
              customHeight: parseFloat(customHeight.value),
              pageLayout: document.querySelector('input[name="orientation"]:checked').value,
              imagesPerPage: document.querySelector('input[name="images-per-page"]:checked').value,
              gridRows: parseInt(gridRows.value),
              gridCols: parseInt(gridCols.value),
              marginSize: parseInt(marginSize.value),
              borderStyle: document.querySelector('input[name="border-style"]:checked').value,
              borderWidth: parseInt(borderWidth.value),
              borderColor: borderColor.value,
              pageSpread: pageSpread.value,
              backgroundColor: backgroundColor.value,
              compression: parseFloat(compression.value),
              filename: outputFilename.value || 'document',
              title: pdfTitle.value,
              author: pdfAuthor.value,
              subject: pdfSubject.value,
              protection: document.querySelector('input[name="pdf-protection"]:checked').value,
              password: document.getElementById('pdf-password')?.value,
              passwordConfirm: document.getElementById('pdf-password-confirm')?.value
          };
          
          // Validate password if protection is enabled
          if (settings.protection === 'password') {
              if (!settings.password || !settings.passwordConfirm) {
                  alert('Please enter and confirm the password.');
                  return;
              }
              
              if (settings.password !== settings.passwordConfirm) {
                  alert('Passwords do not match.');
                  return;
              }
              
              if (settings.password.length < 4) {
                  alert('Password must be at least 4 characters long.');
                  return;
              }
          }
          
          // Initialize PDF
          const pdf = new jsPDF({
              unit: 'mm',
              compress: true
          });
          
          // Set metadata
          if (settings.title) pdf.setProperties({ title: settings.title });
          if (settings.author) pdf.setProperties({ author: settings.author });
          if (settings.subject) pdf.setProperties({ subject: settings.subject });
          
          // Set page size
          let pageWidth, pageHeight;
          
          switch (settings.pageSize) {
              case 'a4':
                  pageWidth = 210;
                  pageHeight = 297;
                  break;
              case 'letter':
                  pageWidth = 215.9;
                  pageHeight = 279.4;
                  break;
              case 'legal':
                  pageWidth = 215.9;
                  pageHeight = 355.6;
                  break;
              case 'a5':
                  pageWidth = 148;
                  pageHeight = 210;
                  break;
              case 'custom':
                  pageWidth = settings.customWidth;
                  pageHeight = settings.customHeight;
                  break;
          }
          
          // Adjust for landscape if needed
          if (settings.pageLayout === 'landscape' || 
              (settings.pageLayout === 'auto' && pageWidth < pageHeight)) {
              [pageWidth, pageHeight] = [pageHeight, pageWidth];
          }
          
          // Calculate available space for images (accounting for margins)
          const availableWidth = pageWidth - (settings.marginSize * 2);
          const availableHeight = pageHeight - (settings.marginSize * 2);
          
          // Determine how many images per page
          let imagesPerPage = 1;
          let rows = 1;
          let cols = 1;
          
          if (settings.imagesPerPage === 'custom') {
              rows = settings.gridRows;
              cols = settings.gridCols;
              imagesPerPage = rows * cols;
          } else {
              imagesPerPage = parseInt(settings.imagesPerPage);
              
              switch (imagesPerPage) {
                  case 2:
                      rows = 2;
                      cols = 1;
                      break;
                  case 4:
                      rows = 2;
                      cols = 2;
                      break;
              }
          }
          
          // Calculate cell dimensions
          const cellWidth = availableWidth / cols;
          const cellHeight = availableHeight / rows;
          
          // Process images in batches (per page)
          const totalImages = uploadedFiles.length;
          let currentImageIndex = 0;
          let currentPage = 0;
          
          while (currentImageIndex < totalImages) {
              // Add new page if not the first page
              if (currentPage > 0) {
                  pdf.addPage([pageWidth, pageHeight]);
              }
              
              // Set background color
              pdf.setFillColor(settings.backgroundColor);
              pdf.rect(0, 0, pageWidth, pageHeight, 'F');
              
              // Process images for this page
              const imagesForThisPage = uploadedFiles.slice(
                  currentImageIndex, 
                  currentImageIndex + imagesPerPage
              );
              
              // Calculate positions for each image
              for (let i = 0; i < imagesForThisPage.length; i++) {
                  const file = imagesForThisPage[i];
                  
                  // Calculate row and column
                  const row = Math.floor(i / cols);
                  const col = i % cols;
                  
                  // Calculate position
                  const x = settings.marginSize + (col * cellWidth);
                  const y = settings.marginSize + (row * cellHeight);
                  
                  // Read image as data URL
                  const imageUrl = await readFileAsDataURL(file);
                  
                  // Add image to PDF
                  try {
                      pdf.addImage({
                          imageData: imageUrl,
                          x: x,
                          y: y,
                          width: cellWidth,
                          height: cellHeight,
                          compression: settings.compression < 1 ? 'FAST' : 'NONE',
                          quality: settings.compression
                      });
                      
                      // Add border if enabled
                      if (settings.borderStyle !== 'none') {
                          pdf.setDrawColor(settings.borderColor);
                          pdf.setLineWidth(settings.borderWidth);
                          
                          if (settings.borderStyle === 'dashed') {
                              pdf.dashedLine(x, y, x + cellWidth, y, 2, 2);
                              pdf.dashedLine(x + cellWidth, y, x + cellWidth, y + cellHeight, 2, 2);
                              pdf.dashedLine(x + cellWidth, y + cellHeight, x, y + cellHeight, 2, 2);
                              pdf.dashedLine(x, y + cellHeight, x, y, 2, 2);
                          } else if (settings.borderStyle === 'dotted') {
                              pdf.dottedLine(x, y, x + cellWidth, y, 0.5, 3);
                              pdf.dottedLine(x + cellWidth, y, x + cellWidth, y + cellHeight, 0.5, 3);
                              pdf.dottedLine(x + cellWidth, y + cellHeight, x, y + cellHeight, 0.5, 3);
                              pdf.dottedLine(x, y + cellHeight, x, y, 0.5, 3);
                          } else {
                              pdf.rect(x, y, cellWidth, cellHeight);
                          }
                      }
                  } catch (error) {
                      console.error(`Error adding image ${file.name}:`, error);
                  }
                  
                  // Update progress
                  const progress = Math.round(((currentImageIndex + i + 1) / totalImages) * 100);
                  progressFill.style.width = `${progress}%`;
                  progressPercent.textContent = `${progress}%`;
              }
              
              currentImageIndex += imagesPerPage;
              currentPage++;
          }
          
          // Handle page spread if enabled
          if (settings.pageSpread !== 'none') {
              // This would require more complex PDF manipulation
              // For demo purposes, we'll just add a blank page if total pages is odd
              if (currentPage % 2 !== 0 && settings.pageSpread === 'book') {
                  pdf.addPage([pageWidth, pageHeight]);
                  pdf.setFillColor(settings.backgroundColor);
                  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
              }
          }
          
          // Apply password protection if enabled
          if (settings.protection === 'password') {
              pdf.setEncryption({
                  userPassword: settings.password,
                  ownerPassword: settings.password,
                  userPermissions: ['print', 'modify', 'copy', 'annot-forms']
              });
          }
                  // Save PDF
        pdf.save(`${settings.filename}.pdf`);
        
        // Reset progress bar after a short delay
        setTimeout(() => {
            progressContainer.classList.add('hidden');
            progressFill.style.width = '0%';
            progressPercent.textContent = '0%';
        }, 1000);
    }
    
    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            
            reader.readAsDataURL(file);
        });
    }
});